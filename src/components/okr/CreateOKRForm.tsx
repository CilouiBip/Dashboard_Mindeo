import React, { useState } from 'react';
import { Form, Input, Button, Space, InputNumber, Select, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { CreateOKRInput } from '../../lib/supabase/services/okrService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as okrService from '../../lib/supabase/services/okrService';

interface CreateOKRFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateOKRForm({ onSuccess, onCancel }: CreateOKRFormProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: CreateOKRInput) => okrService.createWithKeyResults(values),
    onSuccess: (data) => {
      if (data.error) {
        message.error(data.error.message || 'Failed to create OKR');
        return;
      }
      message.success('OKR created successfully');
      queryClient.invalidateQueries(['okrs']);
      form.resetFields();
      onSuccess?.();
    },
    onError: (error) => {
      message.error('Failed to create OKR');
      console.error('[DEBUG] Error creating OKR:', error);
    }
  });

  const onFinish = (values: any) => {
    const input: CreateOKRInput = {
      objective: values.objective,
      status: 'active',
      key_results: values.key_results.map((kr: any) => ({
        metric: kr.metric,
        target: kr.target,
        unit: kr.unit,
        current: 0,
        initiatives: kr.initiatives?.map((init: any) => ({
          title: init.title,
          description: init.description,
          status: 'todo'
        })) || []
      }))
    };

    createMutation.mutate(input);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="objective"
        label="Objective"
        rules={[{ required: true, message: 'Please input the objective' }]}
      >
        <Input.TextArea rows={3} placeholder="Enter your objective" />
      </Form.Item>

      <Form.List name="key_results">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'metric']}
                  rules={[{ required: true, message: 'Missing metric' }]}
                >
                  <Input placeholder="Metric" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'target']}
                  rules={[{ required: true, message: 'Missing target' }]}
                >
                  <InputNumber placeholder="Target" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'unit']}
                  rules={[{ required: true, message: 'Missing unit' }]}
                >
                  <Input placeholder="Unit" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Key Result
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={createMutation.isLoading}>
            Create OKR
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
