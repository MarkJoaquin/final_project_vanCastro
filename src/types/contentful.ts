export type DrivingInstructor = {
  name: string;
  avatar: string;
  avatar_2: string;
  avatar3:{
    fields:{
      file:{
        url:string
      }
    }
  };
  description: string;
  bio: string;
  phone: string;
  email: string;
  yearsOfExperience: number;
  languages: string[];
  availability: string;
  fields: {
    file: {
      url: string;
    };
  };
};
