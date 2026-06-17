import { ghGraphQL } from './services/github.js';

async function test() {
  const query = `
    query {
      search(query: "label:\\"good first issue\\" topic:react state:open is:public", type: ISSUE, first: 1) {
        issueCount
      }
    }
  `;
  try {
    const data = await ghGraphQL(query);
    console.log("No language:", data.search.issueCount);

    const query2 = `
      query {
        search(query: "label:\\"good first issue\\" topic:react language:javascript state:open is:public", type: ISSUE, first: 1) {
          issueCount
        }
      }
    `;
    const data2 = await ghGraphQL(query2);
    console.log("With language:javascript:", data2.search.issueCount);
    
    const query3 = `
      query {
        search(query: "label:\\"good first issue\\" language:javascript React state:open is:public", type: ISSUE, first: 1) {
          issueCount
        }
      }
    `;
    const data3 = await ghGraphQL(query3);
    console.log("With 'React' keyword:", data3.search.issueCount);
  } catch (err) {
    console.error(err);
  }
}

test();
