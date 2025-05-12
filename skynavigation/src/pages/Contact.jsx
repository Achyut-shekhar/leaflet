import React from "react";

const teamMembers = [
  {
    name: "Dishant Dhyani",
    image: "/images/dishant.jpg",
    email: "dishantdhyani01@gmail.com",
    linkedin: "https://www.linkedin.com/in/dishantdhyani01",
    github: "https://github.com/Dishantdhyani",
    
  },
  {
    name: "Achyut Shekhar Singh",
    image: "/images/achyut.jpg",
    email: "achyutshekhar54@gmail.com",
    linkedin: "https://www.linkedin.com/in/achyut-shekhar-singh?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/Achyut-shekhar",
    
  },
  {
    name: "Anshika Nautiyal",
    image: "/images/anshika.jpg",
    email: "anshika.nautiyal2005@gmail.com",
    linkedin: "https://www.linkedin.com/in/anshika-nautiyal-04076a29b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/AnshikaNautiyal1",
    
  },
  {
    name: "Vaibhav Rawat",
    image: "/images/vaibhav.jpg",
    email: "Vaibhavrawat3182@gmail.com",
    linkedin: "https://www.linkedin.com/in/vaibhav-rawat-61399a282/",
    github: "https://github.com/vaibhavrawat25",
    
  }
];

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A passionate group of developers dedicated to creating innovative solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 transition-transform duration-300"
                  />
                  
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>
                
                <a
                  href={`mailto:${member.email}`}
                  className="text-sm text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                >
                  {member.email}
                </a>
                
                <div className="flex space-x-4">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5C4.98 5 3.87 6 2.49 6H2.48C1.1 6 0 5 0 3.5 0 2.01 1.1 1 2.48 1 3.87 1 4.98 2 4.98 3.5zM.4 8.08H4.6V24H.4V8.08zM7.5 8.08h4V10h.06c.56-1.06 1.94-2.18 3.99-2.18 4.27 0 5.05 2.81 5.05 6.47V24h-4.2v-7.94c0-1.89-.03-4.33-2.64-4.33-2.65 0-3.06 2.07-3.06 4.2V24H7.5V8.08z" />
                    </svg>
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.263.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.81 1.304 3.495.997.108-.776.418-1.305.76-1.605-2.665-.304-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.524.117-3.176 0 0 1.005-.322 3.3 1.23.957-.266 1.98-.398 3-.403 1.02.005 2.043.137 3 .403 2.28-1.552 3.285-1.23 3.285-1.23.655 1.653.243 2.874.12 3.176.77.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.81 1.103.81 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.7.825.58C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;
