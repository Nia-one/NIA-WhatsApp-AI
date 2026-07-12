import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import UserForm from "../../components/users/UserForm";
import api from "../../services/api";

export default function UsersPage() {


  const [openUserForm, setOpenUserForm] = useState(false);

  const [users, setUsers] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");



  const fetchUsers = async () => {

    try {

      setLoading(true);


      const response = await api.get(
        "/admin/users"
      );


      const userData =
        response.data.data || [];


      setUsers(userData);

      setFilteredUsers(userData);


    } catch (error) {


      console.error(
        "Failed to load users",
        error
      );


    } finally {

      setLoading(false);

    }

  };




  useEffect(() => {

    fetchUsers();

  }, []);





  useEffect(() => {


    const result = users.filter((user) =>

      user.name
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      user.email
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      user.role
        ?.toLowerCase()
        .includes(search.toLowerCase())

    );


    setFilteredUsers(result);


  }, [search, users]);






  const handleAddUser = () => {

    setOpenUserForm(true);

  };





  const handleUserCreated = () => {

    fetchUsers();

  };





  const formatRole = (role) => {


    if (!role) return "";


    return role
      .replace("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );


  };





  return (

    <div className="space-y-6">



      <div className="flex items-center justify-between">


        <div>

          <h1 className="text-3xl font-bold">

            User Management

          </h1>


          <p className="mt-1 text-slate-500">

            Manage admin users and their roles.

          </p>


        </div>




        <button

          onClick={handleAddUser}

          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"

        >

          <Plus size={18}/>

          Add User


        </button>


      </div>





      <div className="rounded-2xl bg-white p-5 shadow">





        <div className="mb-5 flex items-center gap-3">


          <Search size={18}/>


          <input

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

            placeholder="Search user..."

            className="w-full rounded-xl border p-3"

          />


        </div>






        <table className="w-full">


          <thead>


            <tr className="border-b">


              <th className="py-3 text-left">

                Name

              </th>



              <th className="text-left">

                Email

              </th>



              <th className="text-left">

                Role

              </th>



              <th className="text-center">

                Actions

              </th>


            </tr>


          </thead>





          <tbody>



          {loading && (


            <tr>


              <td

                colSpan="4"

                className="py-5 text-center"

              >

                Loading users...

              </td>


            </tr>


          )}






          {!loading &&
          filteredUsers.length === 0 && (


            <tr>


              <td

                colSpan="4"

                className="py-5 text-center"

              >

                No users found


              </td>


            </tr>


          )}






          {!loading && filteredUsers.map((user)=>(



            <tr

              key={user.id}

              className="border-b"

            >



              <td className="py-4">

                {user.name}

              </td>




              <td>

                {user.email}

              </td>




              <td>

                {formatRole(user.role)}

              </td>





              <td>


                <div className="flex justify-center gap-4">



                  <button>

                    <Edit size={18}/>

                  </button>





                  <button className="text-red-600">

                    <Trash2 size={18}/>

                  </button>



                </div>


              </td>




            </tr>



          ))}



          </tbody>


        </table>



      </div>






      <UserForm


        open={openUserForm}


        onClose={() =>

          setOpenUserForm(false)

        }


        onSuccess={handleUserCreated}


      />



    </div>

  );

}