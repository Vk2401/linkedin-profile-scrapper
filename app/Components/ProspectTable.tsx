// components/DataTable.tsx
import React from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';


interface EmployeeData {
  firstname: string;
  lastname: string;
  position: string;
  gender: string;
  location: string;
  profileLink: string;
}

const columns: ColumnsType<EmployeeData> = [
  {
    title: 'First Name',
    dataIndex: 'firstname',
    key: 'firstname',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastname',
    key: 'lastname',
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Profile',
    key: 'profileLink',
    render: (_, record) => <a href={record.profileLink} target="_blank" rel="noopener noreferrer">View Profile</a>
  },
];

interface DataTableProps {
  dataSource: any;
  employeeData:any;
  setCurrentPage:Function;

}

const ProspectTable: React.FC<DataTableProps> = ({ dataSource,employeeData,setCurrentPage }) => {
  const currentPage = (employeeData.paging.start / employeeData.paging.count) ;
  return (
    <>
    
    {dataSource && <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: currentPage,
          pageSize: employeeData.paging.count || 10,
          total: employeeData.paging.total,
          onChange: (page, pageSize) => {
            // You may need to fetch new data based on page and pageSize
            console.log('Current page:', page, 'Page size:', pageSize);
            let start = page !=1 ? page*employeeData.paging.count : 0;
            setCurrentPage( start);
          }
        }}
        rowKey="profileLink" // Assuming profile links are unique
      />}
    </>
  );
};

export default ProspectTable;
