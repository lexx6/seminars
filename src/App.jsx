import { useEffect, useState } from 'react'
import './App.css'
import { Layout, Table, Button, Modal, Flex, Form, Input, DatePicker, TimePicker, Upload, Spin } from 'antd'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const {TextArea} = Input

function App() {
  const [data, setData] = useState([])
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [idToActWith, setIdToActWith] = useState(undefined)
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleModalDeleteOk = async () => {
    setIsLoading(true)
    setOpenModalDelete(false)
    await deleteRow(idToActWith)
    setIdToActWith(undefined)
    fetchData()
  }

  const handleDelete = (id) => () => {
    setIdToActWith(id)
    setOpenModalDelete(true);
  }

  const handleEdit = (id) => () => {
    setIdToActWith(id)
    setOpenModalEdit(true);
  }

  // Текущая строка для взаимодействия (удаление/редактирование)
  const getRowToActWith = () => data.find(e => e.id === idToActWith)

  const deleteRow = (id) => fetch(`/seminars/${id}`, { method: 'DELETE' })

  // Описание колонок таблицы
  const columns = [
    {
      title: 'Заголовок',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Время',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Фото',
      dataIndex: 'photo',
      key: 'photo',
      render: (element) => <a href={element} target="_blank">{element}</a>
    },
    {
      title: '',
      key: 'action',
      render: (e, row) => (
        <Flex gap="small" vertical={false}>
          <Button color="default" variant="filled" icon={<DeleteOutlined />} onClick={handleDelete(row.id)}/>
          <Button color="default" variant="filled" icon={<EditOutlined />} onClick={handleEdit(row.id)}/>
        </Flex>
      )
    },
  ];
  
  // функция получения данных с сервера
  const fetchData = async () => {
    setIsLoading(true)
    const response = await fetch('/seminars');
    if (response.ok) {
      const data = await response.json()
      setData(data.map((e, idx) => {
        return {
          ...e,
          key: idx,
        }
      }))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      {/* Основная таблица */}
      <Table 
        dataSource={data}
        columns={columns}
        isLoading={isLoading}
        pagination={false}
        bordered
      />
      {/* Модал подтверждения удаления записи */}
      <Modal
        open={openModalDelete}
        onOk={handleModalDeleteOk}
        onClose={() => setOpenModalDelete(false)}
        onCancel={() => setOpenModalDelete(false)}
        okText="Да"
        cancelText="Нет"
      >
        <p>Вы хотите удалить эту строку?</p>
      </Modal>
      {/* Модал редактировая записи */}
      <Modal
        open={openModalEdit}
        onOk={() => setOpenModalEdit(false)}
        closable={false}
        onCancel={() => setOpenModalEdit(false)}
        okText="Сохранить"
        cancelText="Отмена"
        title={`Редактировать: ${getRowToActWith()?.title}`}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
          style={{marginTop: 30}}
        >
          <Form.Item label="Заголовок">
            <Input value={getRowToActWith()?.title} />
          </Form.Item>
          <Form.Item label="Описание">
            <TextArea rows={3} value={getRowToActWith()?.description} />
          </Form.Item>
          <Form.Item label="Дата">
            <DatePicker defaultValue={dayjs(getRowToActWith()?.date, 'DD.MM.YYYY')} format={'DD.MM.YYYY'}/>
          </Form.Item>
          <Form.Item label="Время">
            <TimePicker defaultValue={dayjs(getRowToActWith()?.time, 'HH:mm')} format={'HH:mm'}/>
          </Form.Item>
          <Form.Item label="Фото">
            <Upload action="/api/seminars/upload">
              <Button icon={<UploadOutlined />}>Загрузить файл</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {/* Крутилка состояния загрузки */}
      <Spin size="large" spinning={isLoading} fullscreen/>
    </Layout>
  )
}

export default App
