const URL = import.meta.env.REACT_APP_ROUTE;

  //crear classe

export async function createClass(name,teacher_id) {
    try {
      if (!name || !teacher_id) {
        throw new Error('Name and teacher_id are required');
      }
  
      const response = await fetch(`${URL}/api/class`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
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
      console.error("Error en Communication Manager:", error);
      throw error;
    }
  };
  //get de cuando estes dentro te salga lista de todos los alumnos

  export async function getClasse(class_id) {
    try {
        if (!class_id ) {
            throw new Error('Class_id are required');
        }
      const response = await fetch(`${URL}/getClassInfo`);
      console.log(response)
      if (!response.ok) {
        throw new Error(`Request error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error("Communication Manager error:", error);
      throw error;
    }
  }

    //unirse a clase

    export async function joinClass(class_code,user_id) {
        try {
          if (!class_code || !user_id) {
            throw new Error('Class_code and user-_id are required');
          }
      
          const response = await fetch(`${URL}/api/class/enroll`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(response),
        });
          console.log(response)
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error class doesn't exist: ${errorText}`);
          }
      
          const data = await response.json();
          console.log(data);
          return data;
        } catch (error) {
          console.error("Error en Communication Manager:", error);
          throw error;
        }
      };
 