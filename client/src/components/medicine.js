import axios from "axios";


async function getData(query) {
    try {
      console.log(query);
      const response = await axios.get('http://localhost:5000/medicine/search-product/', {
        params: {
          query: query
        }
      });
      const api = response.data.result;
    //   this.medicine = api;
      return api
    } catch (error) {
      console.log("disini eror");
      console.error(error);
      throw error;
    }
  } 

  async function getMedicineDetail(slug) {
  try {
    const response = await axios.get(`http://localhost:5000/medicine/detail-product/`, {
      params: {
        query: slug
      }
    });
    console.log(response);
    alert(response.data.description);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export {getData, getMedicineDetail}