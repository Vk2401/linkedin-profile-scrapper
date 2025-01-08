require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('querystring');

const LI_AT_COOKIE = process.env.LI_AT_COOKIE;
const JSESSIONID = "ajax:2559691624255767647";

let headers = {
  'User-Agent':
  'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
  'Content-type': 'application/json',
  'Csrf-Token': JSESSIONID,
  'Cookie':`li_at=${LI_AT_COOKIE}; JSESSIONID=${JSESSIONID}`
}
const cookies_dict = {"li_at": LI_AT_COOKIE, "JSESSIONID": JSESSIONID}
async function get_company_id(url) {
  const companyEncoded = qs.escape(url)
  const apiURL = `https://www.linkedin.com/voyager/api/voyagerOrganizationDashCompanies?decorationId=com.linkedin.voyager.dash.deco.organization.MiniCompany-10&q=universalName&universalName=${companyEncoded}`;

  try {
    const response = await axios.get(apiURL, {
      headers: headers,
      timeout: 30000, // Timeout set for 30 seconds
      withCredentials: true // This should be inside the second parameter object
    });
    
    const data = await response.data;
    let companyId = '';



    // Check if data.elements is truthy and has at least one element before trying to access its properties
    if (data.elements && data.elements.length > 0) {
        companyId = data.elements[0].entityUrn.split(":").pop(); // Extracting the company ID
    }

    return {companyId:companyId,data:data};
  
 

  
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error.message);
    return '';
  }
}


async function getEmployeeData(companyId, start=0, count = 10) {
  const apiURL = `https://www.linkedin.com/voyager/api/search/dash/clusters?decorationId=com.linkedin.voyager.dash.deco.search.SearchClusterCollection-165&origin=COMPANY_PAGE_CANNED_SEARCH&q=all&query=(flagshipSearchIntent:SEARCH_SRP,queryParameters:(currentCompany:List(${companyId}),resultType:List(PEOPLE)),includeFiltersInResponse:false)&count=${count}&start=${start}`;

  try {
    const response = await axios.get(apiURL, {
      headers: headers,
      timeout: 30000, // Timeout set for 30 seconds
      withCredentials: true // This should be inside the second parameter object
    });
    console.log(response)
      return response.data; // Return the JSON response directly
  } catch (error) {
      console.error('Error fetching LinkedIn data:', error.message);
      return null; // Return null or an appropriate error response
  }
}

// Dummy implementation for parse_employee_results to show how it might be structured

function parseEmployeeResults(results, includePrivateProfiles = false) {
  const employeeDict = [];

  results.forEach(employee => {
      let firstname ;
      let lastname ;
      let position ;
      let gender ;
      let location ;
      let profileLink ;

      try {
          let accountName = cleanData(employee.itemUnion.entityResult.title.text).split(" ");
          if (accountName.length === 2) {
              firstname = accountName[0];
              lastname = accountName[1];
          } else {
              firstname = accountName.slice(0, -1).join(" ");
              lastname = accountName[accountName.length - 1];
          }
      } catch (error) {
          // Failed to extract or clean the name
          console.error('Error parsing name:', error.message);
      }

      try {
          position = cleanData(employee.itemUnion.entityResult.primarySubtitle.text);
      } catch (error) {
          // No position data available, default "N/A" will be used
      }

      try {
          location = employee.itemUnion.entityResult.secondarySubtitle.text;
      } catch (error) {
          // No location data available, default "N/A" will be used
      }

      try {
          profileLink = employee.itemUnion.entityResult.navigationUrl.split("?")[0];
      } catch (error) {
          // No navigation URL available, default "N/A" will be used
      }

      // Filtering based on provided arguments and data conditions
      if (includePrivateProfiles) {
          employeeDict.push({
              firstname, lastname, position, gender, location, profileLink
          });
      } else {
          if (firstname !== "LinkedIn" && lastname !== "Member" && (firstname|| lastname|| position|| gender|| location|| profileLink)) {
              employeeDict.push({
                  firstname, lastname, position, gender, location, profileLink
              });
          }
      }
  });

  return employeeDict;
}

function cleanData(data) {
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2500}-\u{2BEF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}\u{1F926}-\u{1F937}\u{10000}-\u{10FFFF}\u{2640}-\u{2642}\u{2600}-\u{2B55}\u{200D}\u{23CF}\u{23E9}\u{231A}\u{FE0F}\u{3030}]/gu;

  let cleaned = data.replace(emojiRegex, '').trim();
  cleaned = cleaned.replace(/Ü/g, 'Ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe')
    .replace(/ü/g, 'ue').replace(/ä/g, 'ae').replace(/ö/g, 'oe');
  cleaned = cleaned.replace(/,/g, '');
  cleaned = cleaned.replace(/;/g, ',');

  // Replace other non-ASCII characters
  return cleaned.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

async function fetchCompanyDatas(searchTxt) {
  try {
    const url = `https://www.linkedin.com/voyager/api/graphql?variables=(keywords:${searchTxt},query:(showFullLastNameForConnections:true,typeaheadFilterQuery:()),type:COMPANY)&queryId=voyagerSearchDashReusableTypeahead.54529a68d290553c6f24e28ab3448654`;


    const response = await axios.get(url, {
      headers: headers,
      timeout: 30000, // Timeout set for 30 seconds
      withCredentials: true // This should be inside the second parameter object
    });
   
    const data = await response.data;
 

    // // Assuming the data structure includes an array of companies in the response
    const companies = data.data.searchDashReusableTypeaheadByType.elements.map(company => {
      return {
        title: company.title.text,
        id: company.trackingUrn.split(':').pop() // Assuming the URN is in a format that includes the ID at the end
      };
    });
    console.log(data.data.searchDashReusableTypeaheadByType,'kdikidkkkidkidkk');

    return companies; // You can return this or send it from your endpoint

  } catch (error) {
    console.error('Error fetching company data:', error.message);
  }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Your LinkedIn scraping logic here
      let companyId = req.body.url
      let currentPage = req.body.currentPage || 0
      // let companyId = await get_company_id(linkedInUrl);
      let employeeData = await getEmployeeData(companyId,currentPage);
      


      let employeeDict = [];

        // // Process only the first 3 elements if they exist
        for (let i = 0; i < 3; i++) {
            try {
                const items = employeeData.elements[i].items;
               
                if (items && items.length > 0) {
                    const title = items[0].itemUnion.entityResult.title.text;
                    console.log("Title:", title); // This line mimics the unused variable 'test' in Python

                    // Assuming parse_employee_results is a function that processes and returns structured data
                    const results = parseEmployeeResults(items); 
                    employeeDict = employeeDict.concat(results);
                }
            } catch (error) {
                // Log the error or handle it appropriately
                console.error("Error processing element:", error.message);
            }
        }


      res.status(200).json({ message: "Data fetched successfully!" , empData :employeeDict,employeeData:employeeData});
    } else if (req.method === 'GET') {
      // Assuming the GET request fetches general company data based on a search text
      if (!req.query.searchtext) {
          return res.status(400).json({ error: "Missing search text parameter" });
      }
      let companies = await fetchCompanyDatas(req.query.searchtext);
      res.status(200).json({ message: "Data fetched successfully!", companies: companies || [] });

  } else {
      // Optional: handle other types of requests or send a 405 Method Not Allowed response
      res.status(405).json({ error: "Method Not Allowed" });
  }
  }
  