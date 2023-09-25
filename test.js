// const requestBody = {
//     query: `
//     mutation{
//         createEvent(eventInput:{
//           title:"titleTest",
//           description:"DescriptionTest",
//           date:"2023-09-05T19:44:44.780+00:00"
//         }){
//             title
//             description
//         }
//       }
//     `
// }

// fetch('http://localhost:3000/graphql', {
//     method: 'POST',
//     body: JSON.stringify(requestBody),
//     headers: {
//         'Content-Type': 'application/json'
//     }
// }).then(res => {
//       if (res.status !== 200 && res.status !== 201) {
//         console.log(res)
//         throw new Error('Failed');
//       }
//       return res.json();
//     })
//     .then(resData => {
//       console.log(resData)
//     })
//     .catch(err => {
//       console.log(err)
//     })
  
// -----------------------------------------FetchData---Query-----------------------------------
const requestBody = {
  query: `
    query{
        events{
          _id
          title
          description
        }
      }
    `
}

fetch('http://localhost:3000/graphql', {
  method: 'POST',
  body: JSON.stringify(requestBody),
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(res => {
    if (res.status !== 200 && res.status !== 201) {
      console.log(res)
      throw new Error('Failed');
    }
    return res.json();
  })
  .then(resData => {
    console.log(resData)
  })
  .catch(err => {
    console.log(err)
  })
