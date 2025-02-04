import { useEffect, useState } from 'react'
import './App.css'
import { Layout, Table } from 'antd'

function App() {
  const [data, setData] = useState([])

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
  ];
  
  // функция получения данных с сервера
  const fetchData = async () => {
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
        pagination={false}
        bordered
      />
    </Layout>
  )
}

export default App
