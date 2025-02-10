import { cloneUniformsGroups } from "three/src/renderers/shaders/UniformsUtils";

const URL = process.env.NEXT_PUBLIC_URL;

export async function loginGoogle(uid,name,gmail){
  if(!uid | !name | !gmail){
    throw new Error('Uid,name and gmail are required');
  }
  try{
    const response = await fetch(`${URL}/api/auth/google`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, name, gmail })
  });

  const data = await response.json();

  console.log(data);
  

    if (!data) {
      throw new Error("Respuesta vacía del servidor");
    }
    return {
      hasClass: data.class_id !== null, 
      userData: data,
    };
  } catch (error) {
    console.error("Communication Manager error:", error);
    throw error;
  }
}
export async function createClass(name, teacher_id) {
    try {
      if (!name || !teacher_id) {
        throw new Error('Name and teacher_id are required');
      }
  
      const response = await fetch(`${URL}/api/class`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name, teacher_id}),
    });
      console.log(response)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error getting data from classes: ${errorText}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Communication Manager error:", error);
      throw error;
    }
  };


  export async function joinClass(class_code, user_id) {
    try {
        if (!class_code || !user_id) {
            throw new Error('Class_code and user_id are required');
        }

        console.log("Attempting to join class with:", { class_code, user_id });

        const response = await fetch(`${URL}/api/class/enroll`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({class_code, user_id}),
        });

        console.log("Server Response:", response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Join class success:", data);
        return data;
    } catch (error) {
        console.error("Error in Communication Manager:", error);
        throw error;
    }
}

export async function chargeMessage(userId) {
    try {
        const response = await fetch(`${URL}/messages?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Error al cargar los mensajes');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al cargar los mensajes:", error);
        throw error;
    }
}


export async function sendMessage(body) {
    console.log("New Message", body)
    try {
        console.log("mensaje a: ",URL)
        const response = await fetch(`${URL}/message/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: body.text })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error ${response.status}: ${errorResponse.description || 'Invalid request'}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Fetch error", error);
        throw error;
    }
}


    export async function createLanguage(name) {
      try {
        if (!name) {
          throw new Error('Name is required');
        }
    
        const response = await fetch(`${URL}/api/language`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name}),
      });
        console.log(response)
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error getting languageS: ${errorText}`);
        }
    
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error("Error en Communication Manager:", error);
        throw error;
      }
    };

    export async function getLanguage(class_id) {
      try {
        if (!class_id) {
          throw new Error('Class_id is required');
        }
    
        const response = await fetch(`${URL}/api/class/languages?class_id=${class_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error getting data from language: ${errorText}`);
        }
    
        const data = await response.json();
        return data.languages; 
      } catch (error) {
        console.error("Error en Communication Manager:", error);
        throw error;
      }
    };

    export const  deleteLanguage = async (idlanguage) => {
      const response = await fetch(`${URL}/api/language/${idlanguage}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data;
  }

    export async function getStudents(class_id) {
      try {
        const response = await fetch(`${URL}/api/user?class_id=${class_id}`);  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.body;  
      } catch (error) {
        console.error("Error fetching students:", error);
        throw error;  
      }
    }
    
    
    
