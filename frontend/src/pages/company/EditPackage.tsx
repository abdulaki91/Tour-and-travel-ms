import React from "react";
import { useParams } from "react-router-dom";

const EditPackage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Package</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Package ID: {id}</p>
        <p className="text-gray-600 mt-4">
          Package editing form coming soon...
        </p>
      </div>
    </div>
  );
};

export default EditPackage;
