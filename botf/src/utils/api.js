import axios from 'axios';

export const api = axios.create({
    baseURL: "https://nothing-server.vercel.app/api", // Use HTTP for local development
  });
  

  export const createUser = async (email,password) => {
    try {
      await api.post(
     `/user/register`,
       { email , password},
       
       
     );
   } catch (err) {
     console.log("Something wrong");
     throw err;
   }
 };

 export const createResidency = async (data) => {
console.log(data)
 
 
};


export const getAllProperties = async () => {
  try {
    const response = await api.get("/residency/allres", {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    console.log(error)
     throw error;
  }
};
export const getAll = async () => {
  try {
    const response = await api.get("/residency/allresies", {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    console.log(error)
     throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`, {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong ssh");
    throw error;
  }
};

export const getAllLikes = async () => {
  const email = localStorage.getItem("teleNumber")
 
   try {
    const res = await api.post(
      `/user/allLikes`,
      {
        email,
      },
      
    );
    console.log(res.data,"asdfghjkkjhgfdsdfghjk")
    return res.data;

    
  } catch (error) {
    // toast.error("Something went wrong while fetching bookings");
    // throw error

    console.log(error)
  }
}

export const getAllUsers = async () => {
  try {
    const response = await api.get("/user/allusers", {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong userall");
    throw error;
  }
};




export const getAllDraft = async () => {
  console.log("Hiii")
  try {
    const response = await api.get("/residency/allownerdrafts", {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  }  catch (error) {
    console.log("Something went wrong ");
    throw error;
  }
};



export const getAllDraftAgent = async () => {
  console.log("Hiii")
  try {
    const response = await api.get("/residency/allagentdrafts", {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  }  catch (error) {
    console.log("Something went wrong ");
    throw error;
  }
};
