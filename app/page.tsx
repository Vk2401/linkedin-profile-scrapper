"use client"
import { useEffect, useState } from "react";
import ProspectTable from "./Components/ProspectTable"
import { Select } from 'antd';

const { Option } = Select;
export default function Home() {
  const [companyUrl, setCompanyUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [empData, setEmpData] = useState<any>()
  const [companyData, setCompanyData] = useState<any>()
  const [responceData, setResponceData] = useState<any>()
  
  const [currentPage, setCurrentPage] = useState<any>(0)


  const [data, setData] = useState(null);

  useEffect(() => {
    if(empData){
      fetchLinkedInData();
    }
  }, [currentPage]);

  const fetchLinkedInData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/linkedin/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: companyUrl,currentPage:currentPage }),
      });
      const result = await response.json();
      setData(result);
console.log(result.employeeData)
      setEmpData(result.empData)
      setResponceData(result.employeeData)
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
    } finally {
      setIsLoading(false);

    }
  };

  const getCompanies = async (searchtext:any) => {
    try {
     

      // Constructing the URL with the query string
    const url = new URL('/api/linkedin/route', window.location.origin);
    url.searchParams.append('searchtext', searchtext);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
      const result = await response.json();
  
console.log(result)
setCompanyData(result.companies)

    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
    } finally {
      setIsLoading(false);

    }
  };

  const handleSubmit = async () => {

    fetchLinkedInData()

  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex justify-center gap-8 row-start-2 items-center sm:items-start flex-col">



        <div className="flex gap-4 items-center flex-col">
          {/* <input type="text"
            value={companyUrl}
            onChange={(e) => {
              setCompanyUrl(e.target.value)
              getCompanies(e.target.value)
            }}
            className="rounded-full border focus:bg-white focus:bottom-0 border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 md:w-[50vw] px-4 sm:px-5"
            placeholder="Enter Company url"
          /> */}

<Select
      showSearch
      value={companyUrl}
      placeholder="Select a company"
      notFoundContent={isLoading ? 'Loading...' : 'No companies found'}
      onSearch={getCompanies}
      onChange={(value) => setCompanyUrl(value)}
      filterOption={false} // The filtering is done server-side
      style={{ width: '50vw',color:'black' }}
    >
      {companyData &&  companyData.map((company:any) => (
        <Option key={company.id} value={company.id}>{company.title}</Option>
      ))}
    </Select>


          <span onClick={handleSubmit}
            className="rounded-full cursor-pointer border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          >
            Get Profiles
          </span>

          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="dot-flashing"></div>
              <div className="dot-flashing"></div>
              <div className="dot-flashing"></div>
            </div>
          ) : (
            <div className="text-center">
              
              {empData && <ProspectTable dataSource={empData} employeeData={responceData} setCurrentPage={setCurrentPage}/>}
            </div>
          )}
        </div>


      </main>

    </div>
  );
}
