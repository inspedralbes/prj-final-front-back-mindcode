const URL = process.env.NEXT_PUBLIC_URL;

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
    

    export async function getStudents(class_id) {
      try {
        const response = await fetch(`${URL}/api/user?class_id=${class_id}`);  // Asegúrate de que la API esté recibiendo el class_id
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
    
    
    
 