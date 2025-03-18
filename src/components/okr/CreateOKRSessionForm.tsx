import React, { useEffect } from 'react';
import { Form, Input, Button, Space, Typography, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { okrCore } from '../../lib/supabase/services/okrCore';
import { logger } from '../../lib/logger';

const COMPONENT_TAG = '[CreateOKRSessionForm]';
const { Title } = Typography;

interface CreateOKRSessionFormProps {
  onSubmit: (values: any) => void;
  initialData?: any;
}

export default function CreateOKRSessionForm({ onSubmit, initialData }: CreateOKRSessionFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      logger.info(COMPONENT_TAG, 'Setting initial form data:', { initialData });
      form.setFieldsValue({
        name: initialData.name,
        description: initialData.description,
        objectives: initialData.objectives
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleSubmit = async (values: any) => {
    try {
      logger.info(COMPONENT_TAG, 'Submitting form:', { values });
      const session: any = {
        name: values.name,
        description: values.description,
        objectives: values.objectives?.map((obj: any) => ({
          title: obj.title,
          description: obj.description,
          key_results: obj.key_results?.map((kr: any) => ({
            kr_name: kr.kr_name,
            target_value: kr.target_value,
            target_unit: kr.target_unit,
          }))
        }))
      };

      await okrCore.createSession(session);
      form.resetFields();
    } catch (error) {
      logger.error(COMPONENT_TAG, 'Error submitting form:', { error });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        name="name"
        label="Session Name"
        rules={[{ required: true, message: 'Please enter a session name' }]}
      >
        <Input placeholder="Q1 2025 OKRs" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <Input.TextArea placeholder="Session description..." />
      </Form.Item>

      <Title level={5}>Objectives</Title>
      <Form.List name="objectives">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ marginBottom: 24 }}>
                <Form.Item
                  {...restField}
                  name={[name, 'title']}
                  rules={[{ required: true, message: 'Missing objective title' }]}
                >
                  <Input placeholder="Objective title" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                >
                  <Input.TextArea placeholder="Objective description" />
                </Form.Item>

                <Form.List name={[name, 'key_results']}>
                  {(krFields, { add: addKR, remove: removeKR }) => (
                    <>
                      {krFields.map((krField, index) => (
                        <Space key={krField.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                          <Form.Item
                            {...krField}
                            name={[krField.name, 'kr_name']}
                            rules={[{ required: true, message: 'Missing KR name' }]}
                          >
                            <Input placeholder="Key Result name" />
                          </Form.Item>

                          <Form.Item
                            {...krField}
                            name={[krField.name, 'target_value']}
                            rules={[{ required: true, message: 'Missing target' }]}
                          >
                            <Input type="number" placeholder="Target" />
                          </Form.Item>

                          <Form.Item
                            {...krField}
                            name={[krField.name, 'target_unit']}
                            rules={[{ required: true, message: 'Missing unit' }]}
                          >
                            <Input placeholder="Unit (%, $, etc)" />
                          </Form.Item>

                          <MinusCircleOutlined onClick={() => removeKR(krField.name)} />
                        </Space>
                      ))}

                      <Form.Item>
                        <Button type="dashed" onClick={() => addKR()} block icon={<PlusOutlined />}>
                          Add Key Result
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                <Button type="text" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                  Remove Objective
                </Button>
              </div>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Objective
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialData ? 'Update Session' : 'Create Session'}
        </Button>
      </Form.Item>
    </Form>
  );
}
