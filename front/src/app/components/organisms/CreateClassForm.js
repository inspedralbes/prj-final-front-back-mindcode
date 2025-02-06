"use client";

import React, { useState } from "react";
import StPage from "../../../pages/StPage";
import { createClass } from "../../../services/communicationManager"; // Import createClass function
import BaseForm from "../molecules/BaseForm"

const CreateClassForm = ({ }) => {
    const [className, setClassName] = useState(""); // Add state for class name
    const [userId, setUserId] = useState(""); // Add state for user ID
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const topText = "Crea una nova Classe"


    const handleCreate = async () => {
        if (className && userId) {
            try {
                console.log("Attempting to create class...");
                const response = await createClass(className, userId);
                console.log("Create class response:", response);

                console.log(response.class_code);

                if (response) {
                    setIsAuthenticated(true);
                } else {
                    alert("Failed to create class. Please check your details.");
                }
            } catch (error) {
                console.error("Error creating class:", error);
                alert("An error occurred while creating the class.");
            }
        } else {
            alert("Please enter all required fields.");
        }
    };

    if (isAuthenticated) {
        return <StPage />;
    }

    return (
        <div className="flex-1 flex">
            <BaseForm topText={topText} sendButtonText={"Create Class"} onSendButtonClick={handleCreate} formValues={
                [
                    { placeholder: "Class Name", text: className, handleOnChange: (e) => setClassName(e.target.value) },
                    { placeholder: "User Id", text: userId, handleOnChange: (e) => setUserId(e.target.value) },
                ]
            } />
        </div>
    )
};

export default CreateClassForm;