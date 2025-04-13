import { fetchInstructors } from "../../api/contentful/fetchInstructors";
import Image from "next/image";
import "./Licensed_Instructors.css";
import type { DrivingInstructor } from "@/types/contentful";



const LicensedInstructors = async () => {
  const instructorsData = await fetchInstructors();

  return (
    <section className="instructors-section">
      <div className="container">
        <div className="flex-container">
          <div className="content-left">
            <h2 className="instructor-title" data-aos="fade-up">
              Licensed
              <br />
              Instructors
            </h2>
            <p className="instructor-description" data-aos="fade-up">
              Our Instructors are skilled and experienced professionals
              dedicated to providing patient and supportive training, ensuring
              that all students leave our driving school with the skills and
              confidence needed to navigate the roads safely.
            </p>
          </div>
          <div className="content-right">
            <div className="circle-container">
              <div className="image-container">
                {instructorsData &&
                  instructorsData.length > 0 &&
                  instructorsData.map((instructor, index) => {
                    const { name, avatar } = instructor.fields;

                    return (
                      <div
                        key={instructor.sys.id}
                        className={`instructor-images-${index}`}
                      >
                        <Image
                          src={
                            (("https:" +
                              (avatar as DrivingInstructor).fields?.file
                                .url) as string) || ""
                          }
                          alt={(name as string) || ""}
                          width={500}
                          height={0} 
                          style={{ height: 'auto' }} 
                          className="instructor-image"
                          priority
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LicensedInstructors;