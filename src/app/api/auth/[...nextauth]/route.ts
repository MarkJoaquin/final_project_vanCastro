import { hashCompare, hashPassword } from '@/lib/hashPass';
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const admin = [
  { id: 1, name: "admin1", languages:["English"], phone:"12345", email:"email1@123", password:"$2b$10$kYS3MFkjoY2j8RabUxTsoeqMdRqStJbzt14Pm1JoKoUoi0vdmQ2y6" }, //initial Password "email1@123"
  { id: 2, name: "admin2", languages:["English"], phone:"12345", email:"email2@234", password:"$2b$10$5IlHpfAT8rNmoF/EqyMCKuh81OO9i0Pa6TbSpyUpLPM7Yk02FM29O" }, //initial Password "email2@234"
];

export const authOptions: NextAuthOptions = {
  session:{
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  providers:[
    CredentialsProvider({
      name:'Email',
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

//        const hashedPassword = await hashPassword("email2@234")
        const isPasswordValid =  await hashCompare(credentials.password,user.password)
        console.log("Password",isPasswordValid)

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
  ],

  pages: {
    signIn: "/auth"
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }