import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const admin = [
  { id: 1, name: "admin1", languages:["English"], phone:"12345", email:"email1@123", password:"email1@123" },
  { id: 2, name: "admin2", languages:["English"], phone:"12345", email:"email2@234", password:"email2@234" },
];

export const authOptions: NextAuthOptions = {
  session:{
    strategy: "jwt"
  },
  providers:[
    CredentialsProvider({
      name:'Sign in',
      credentials:{
        email:{
          label:"Email",
          type: "email",
          placeholder:"hello@example.com"
        },
        password:{
          label:"Password",
          type:"passwod"
        }
      },
      async authorize(credentials){
        if(!credentials?.email || !credentials.password){
          return null;
        }

        //from database
        const user = admin.find((data)=>{
          return data.email === credentials.email
        })

        console.log("CREDE",user)

        if(!user){
          return null
        }

        const isPasswordValid = true
        //const isPasswordValid =  await hashCompare(credentials.email,hashedPassword)

        if (!isPasswordValid){
          return null
        }

        return {
          id:user.id + "",
          email:user.email,
          name:user.name,
        }
      }
    })
  ]
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }