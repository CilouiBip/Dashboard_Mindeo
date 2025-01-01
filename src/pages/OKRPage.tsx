import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as okrService from '../lib/supabase/services/okrService';
import * as initiativeService from '../lib/supabase/services/initiativeService';
import { Initiative } from '../lib/supabase/services/initiativeService';
import { Button, Card, Input, Select, Space, Typography, message } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function OKRPage() {
  const queryClient = useQueryClient();
  const [newInitiative, setNewInitiative] = useState<{ [key: string]: { title: string; description: string } }>({});

  // Updated React Query v5 syntax
  const { data: okrsResponse, isLoading } = useQuery({
    queryKey: ['okrs'],
    queryFn: () => okrService.getAll()
  });

  const okrs = okrsResponse?.data;

  const { data: initiatives } = useQuery({
    queryKey: ['initiatives'],
    queryFn: async () => {
      if (!okrs) return {};
      
      const allInitiatives: { [key: string]: Initiative[] } = {};
      for (const okr of okrs) {
        for (const kr of okr.key_results) {
          const { data } = await initiativeService.getByKeyResultId(kr.id);
          if (data) {
            allInitiatives[kr.id] = data;
          }
        }
      }
      return allInitiatives;
    },
    enabled: !!okrs
  });

  const createInitiativeMutation = useMutation({
    mutationFn: (newInitiative: Omit<Initiative, 'id' | 'created_at'>) => 
      initiativeService.create(newInitiative),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      message.success('Initiative ajoutée avec succès');
    },
    onError: () => {
      message.error('Erreur lors de l\'ajout de l\'initiative');
    }
  });

  const updateInitiativeMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Initiative> }) => 
      initiativeService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      message.success('Initiative mise à jour avec succès');
    }
  });

  const deleteInitiativeMutation = useMutation({
    mutationFn: (id: string) => initiativeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      message.success('Initiative supprimée avec succès');
    }
  });

  const handleAddInitiative = async (krId: string) => {
    if (!newInitiative[krId]?.title) return;

    await createInitiativeMutation.mutateAsync({
      title: newInitiative[krId].title,
      description: newInitiative[krId].description,
      status: 'todo',
      key_result_id: krId
    });

    setNewInitiative(prev => ({
      ...prev,
      [krId]: { title: '', description: '' }
    }));
  };

  if (isLoading) {
    return <div>Chargement des OKRs...</div>;
  }

  return (
    <div className="p-6">
      <Title level={2}>Objectifs et Résultats Clés (OKRs)</Title>
      
      {okrs?.map((okr) => (
        <Card key={okr.id} className="mb-6">
          <Title level={3}>{okr.objective}</Title>
          
          {okr.key_results.map((kr) => (
            <Card key={kr.id} type="inner" className="mb-4">
              <Space direction="vertical" className="w-full">
                <Text strong>
                  {kr.metric} - Objectif: {kr.target}{kr.unit} 
                  (Actuel: {kr.current}{kr.unit})
                </Text>

                {/* Initiatives section */}
                <div className="ml-4">
                  <Title level={5}>Initiatives</Title>
                  
                  {/* List existing initiatives */}
                  {initiatives?.[kr.id]?.map((initiative) => (
                    <Card key={initiative.id} size="small" className="mb-2">
                      <div className="flex justify-between items-center">
                        <Space direction="vertical">
                          <Text strong>{initiative.title}</Text>
                          {initiative.description && (
                            <Text type="secondary">{initiative.description}</Text>
                          )}
                        </Space>
                        <Space>
                          <Select
                            value={initiative.status}
                            onChange={(value) => 
                              updateInitiativeMutation.mutate({
                                id: initiative.id,
                                updates: { status: value }
                              })
                            }
                          >
                            <Select.Option value="todo">À faire</Select.Option>
                            <Select.Option value="in_progress">En cours</Select.Option>
                            <Select.Option value="done">Terminé</Select.Option>
                          </Select>
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />}
                            onClick={() => deleteInitiativeMutation.mutate(initiative.id)}
                          />
                        </Space>
                      </div>
                    </Card>
                  ))}

                  {/* Add new initiative form */}
                  <Card size="small" className="bg-gray-50">
                    <Space direction="vertical" className="w-full">
                      <Input
                        placeholder="Titre de l'initiative"
                        value={newInitiative[kr.id]?.title || ''}
                        onChange={(e) => 
                          setNewInitiative(prev => ({
                            ...prev,
                            [kr.id]: { 
                              ...prev[kr.id],
                              title: e.target.value 
                            }
                          }))
                        }
                      />
                      <Input.TextArea
                        placeholder="Description (optionnelle)"
                        value={newInitiative[kr.id]?.description || ''}
                        onChange={(e) => 
                          setNewInitiative(prev => ({
                            ...prev,
                            [kr.id]: { 
                              ...prev[kr.id],
                              description: e.target.value 
                            }
                          }))
                        }
                      />
                      <Button 
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddInitiative(kr.id)}
                      >
                        Ajouter une initiative
                      </Button>
                    </Space>
                  </Card>
                </div>
              </Space>
            </Card>
          ))}
        </Card>
      ))}
    </div>
  );
}
