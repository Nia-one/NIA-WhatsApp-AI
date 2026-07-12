import { useState } from "react";
import { X } from "lucide-react";
import { createUser } from "../../services/userService";

export default function UserForm({
  open,
  onClose,
  onSuccess,
}) {


  const [formData, setFormData] = useState({

    name: "",
    email: "",
    mobile: "",
    role: "",
    password: "",
    confirmPassword: "",

  });



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({

      ...formData,

      [name]: value,

    });

  };




  const handleSubmit = async () => {


    // =========================
    // Frontend Validation
    // =========================


    if (!formData.name.trim()) {

      alert("Name is required");

      return;

    }



    if (!formData.email.trim()) {

      alert("Email is required");

      return;

    }



    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    if (!emailRegex.test(formData.email)) {

      alert("Please enter a valid email address");

      return;

    }



    if (!/^[0-9]{10,15}$/.test(formData.mobile)) {

      alert(
        "Mobile number must be between 10 and 15 digits"
      );

      return;

    }



    if (!formData.role) {

      alert("Please select a role");

      return;

    }



    if (formData.password.length < 8) {

      alert(
        "Password must be at least 8 characters"
      );

      return;

    }



    if (
      formData.password !==
      formData.confirmPassword
    ) {

      alert(
        "Password and Confirm Password do not match"
      );

      return;

    }



    try {


      const payload = {

        name: formData.name,

        email: formData.email,

        mobile: formData.mobile,

        role: formData.role,

        password: formData.password,

      };



      const response = await createUser(payload);



      console.log(
        "User Created:",
        response
      );



      alert(
        "User created successfully"
      );



      onSuccess();



      onClose();



    } catch (error) {


      console.error(
        "Create User Error:",
        error
      );



      alert(

        error.response?.data?.message ||

        "Failed to create user"

      );


    }


  };



  if (!open) return null;



  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">


      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">



        {/* Header */}


        <div className="flex items-center justify-between border-b px-6 py-4">


          <h2 className="text-xl font-semibold">

            Add User

          </h2>



          <button

            onClick={onClose}

            className="rounded-lg p-2 hover:bg-gray-100"

          >

            <X size={20}/>

          </button>


        </div>





        {/* Body */}


        <div className="grid grid-cols-2 gap-5 p-6">



          <div>

            <label className="mb-1 block text-sm font-medium">

              Full Name <span className="text-red-500">*</span>

            </label>


            <input

              type="text"

              name="name"

              value={formData.name}

              onChange={handleChange}

              className="w-full rounded-lg border px-3 py-2"

              placeholder="Enter full name"

            />

          </div>





          <div>

            <label className="mb-1 block text-sm font-medium">

              Email <span className="text-red-500">*</span>

            </label>


            <input

              type="email"

              name="email"

              value={formData.email}

              onChange={handleChange}

              className="w-full rounded-lg border px-3 py-2"

              placeholder="Enter email"

            />

          </div>





          <div>

            <label className="mb-1 block text-sm font-medium">

              Mobile Number <span className="text-red-500">*</span>

            </label>


            <input

              type="text"

              name="mobile"

              value={formData.mobile}

              onChange={handleChange}

              className="w-full rounded-lg border px-3 py-2"

              placeholder="Enter mobile number"

            />

          </div>





          <div>

            <label className="mb-1 block text-sm font-medium">

              Role <span className="text-red-500">*</span>

            </label>



            <select

              name="role"

              value={formData.role}

              onChange={handleChange}

              className="w-full rounded-lg border px-3 py-2"

            >


              <option value="">

                Select Role

              </option>


              <option value="super_admin">

                Super Admin

              </option>


              <option value="founder">

                Founder

              </option>


              <option value="operations">

                Operations

              </option>


              <option value="analytics">

                Analytics

              </option>


            </select>


          </div>





          <div>

            <label className="mb-1 block text-sm font-medium">

              Password <span className="text-red-500">*</span>

            </label>


            <input

              type="password"

              name="password"

              value={formData.password}

              onChange={handleChange}

              autoComplete="new-password"

              className="w-full rounded-lg border px-3 py-2"

              placeholder="Enter password"

            />


          </div>





          <div>

            <label className="mb-1 block text-sm font-medium">

              Confirm Password <span className="text-red-500">*</span>

            </label>


            <input

              type="password"

              name="confirmPassword"

              value={formData.confirmPassword}

              onChange={handleChange}

              autoComplete="new-password"

              className="w-full rounded-lg border px-3 py-2"

              placeholder="Confirm password"

            />


          </div>



        </div>






        {/* Footer */}


        <div className="flex justify-end gap-3 border-t px-6 py-4">


          <button

            onClick={onClose}

            className="rounded-lg border px-5 py-2 hover:bg-gray-100"

          >

            Cancel

          </button>




          <button

            onClick={handleSubmit}

            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"

          >

            Save User

          </button>



        </div>



      </div>


    </div>

  );

}