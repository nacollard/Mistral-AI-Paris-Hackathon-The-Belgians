'use client'

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [waiting, setWaiting] = useState([['Local bakery in Paris wins award for best croissant in the city', 'A local bakery in Paris has won the prestigious and highly coveted award for the best croissant in the city, in a competition that was organized and judged by a panel of experts and connoisseurs. The winning bakery, which is known as "Le Croissant Doré", is located in the 10th arrondissement of Paris, and is owned and operated by a husband and wife team, who have been in the baking business for more than 20 years. According to the owners of "Le Croissant Doré", the secret to their award-winning croissant is the use of high-quality and fresh ingredients, such as butter, flour, and yeast, and the application of a traditional and time-honored baking technique, that involves the rolling, folding, and shaping of the dough, and the baking of the croissant at a precise and consistent temperature and time. The owners of "Le Croissant Doré" also noted that they are very proud and honored to have won the award for the best croissant in Paris, and that they are committed to maintaining and improving the quality, taste, and appearance of their croissant, and to providing their customers with the best and most enjoyable experience.', 'news article'],]);
  const [found, setFound] = useState(false);
  const [urgency, setUrgency] = useState('low');
  const [dataQueue, setDataQueue] = useState([
    ['New labor and employment law in France', "The French government has enacted a new labor and employment law, which will come into effect on January 1, 2024. The new law aims to improve the working conditions, benefits, and rights of employees in France, and to promote the growth, competitiveness, and innovation of businesses and organizations. Some of the key provisions of the new labor and employment law in France are: * An increase in the minimum wage, from the current rate of €10.25 per hour to a new rate of €11.50 per hour, for all employees in France, regardless of their age, experience, or industry. * A reduction in the maximum working hours, from the current limit of 35 hours per week to a new limit of 32 hours per week, for all employees in France, with the possibility of additional hours and overtime, subject to the agreement and compensation of the employee. * An expansion in the employee benefits, such as an increase in the paid vacation days, from the current minimum of 25 days per year to a new minimum of 30 days per year, and an introduction of a new paid parental leave, of up to six months, for all employees in France. * A strengthening in the employee rights and protections, such as an enhancement of the anti-discrimination, anti-harassment, and anti-retaliation policies and procedures, and an introduction of a new right to disconnect, which will require employers to respect and protect the employees' personal time and privacy, outside of the working hours and days. The new labor and employment law in France will have a significant and far-reaching impact on the way of working of businesses and organizations in the country, and will require them to adapt and adjust their compensation, scheduling, hiring, and other practices and policies, to ensure their compliance and competitiveness.", 'law'],
    ['New Tweet', "Cybersecurity is more important than ever, and it's great to see the launch of a new #cybersecurity certification and label in France. It will help businesses and organizations to choose and use the best and most reliable #cybersecurity products and services, and to protect and preserve their data and systems. #DataProtection", 'social media post'],
    []
  ]);
  const [responseData, setResponseData] = useState(null);

  const queryingRef = useRef(false);
  const addingRef = useRef(false);

  const callPythonAPI = async (data) => {
    queryingRef.current = true;

    try {
      const response = await fetch('http://localhost:5000/run_python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setResponseData(result);

      setUrgency(result.priority_level.toLowerCase());

      if (result.priority_level.toLowerCase() == 'high') {
        await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: 'High Priority Alert!',
            content: result
          }),
        });
      }

      setFound(true);

      setTimeout(() => {
        setWaiting(prev => prev.filter((item, index) => index != 0));
        setFound(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to fetch data from API:', error);
    }

    queryingRef.current = false;
  };

  useEffect(() => {
    function addToWaiting() {
      if (dataQueue.length > 0 && !addingRef.current) {
        addingRef.current = true;
        let nextItem = dataQueue.shift();
        setWaiting(prev => [...prev, nextItem]);
        setTimeout(() => {
          addingRef.current = false;
          addToWaiting();
        }, 5000);
      }
    }

    if (!addingRef.current) {
      addToWaiting();
    }

    if (waiting.length > 0 && !queryingRef.current) {
      console.log('Querying:', waiting[0]);
      queryingRef.current = true;
      callPythonAPI(waiting[0]);
    }
  }, [waiting[0]]);

  return (
    <main className="container mx-auto flex flex-col-reverse justify-center items-center gap-6">
      {found &&
        <div className="toast toast-top toast-center">
          {urgency == 'low' &&
            <div role="alert" className="alert alert-info text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Low importance</span>
            </div>
          }

          {urgency == 'medium' &&
            <div role="alert" className="alert alert-success text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Medium importance</span>
            </div>
          }

          {urgency == 'high' &&
            <div role="alert" className="alert alert-error text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>High importance! Mail sent.</span>
            </div>
          }
        </div>
      }
      {waiting.map((item, index) => (
        <div key={index} className={`flex gap-4 transition-all duration-500 ease-in-out ${index < waiting.length - 1 ? '-translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <div className={`card ml-4 p-4 justify-center items-center bg-white shadow-sm flex space-x-4 ${index == 0 ? 'scale-105 mr-4 mb-4' : 'scale-100'}`} onClick={() => handleIconClick(index)}>
            <svg className="fill-neutral cursor-pointer" height="30px" viewBox="0 -960 960 960" width="30px">
              {item[2] == 'news article' &&
                <path d="M146.67-120q-27.5 0-47.09-19.58Q80-159.17 80-186.67V-840l67 67 66-67 67 67 67-67 66 67 67-67 67 67 66-67 67 67 67-67 66 67 67-67v653.33q0 27.5-19.58 47.09Q840.83-120 813.33-120H146.67Zm0-66.67h300v-266.66h-300v266.66Zm366.66 0h300v-100h-300v100Zm0-166.66h300v-100h-300v100ZM146.67-520h666.66v-120H146.67v120Z" />
              }
              {item[2] == 'law' &&
                <path d="M160-120v-66.67h480V-120H160Zm223.33-206L160-549.33 234.67-626 460-402.67 383.33-326Zm254-254L414-805.33 490.67-880 714-656.67 637.33-580Zm196 420L302-691.33 348.67-738 880-206.67 833.33-160Z" />
              }
              {item[2] == 'social media post' &&
                <path d="m239.33-160 40-159.33H120L136.67-386H296l47.33-188H184l16.67-66.67H360L399.33-800h66L426-640.67h188.67L654-800h66l-39.33 159.33H840L823.33-574H664l-47.33 188H776l-16.67 66.67H600L560-160h-66l40-159.33H345.33l-40 159.33h-66ZM362-386h188.67L598-574H409.33L362-386Z" />
              }
            </svg>
          </div>
          <div className={`card w-96 bg-white shadow-sm transition-all duration-300 ease-in-out ${index == 0 ? 'scale-105 shadow-2xl mb-4' : 'scale-100 shadow-none'}`}>
            <div className="group card-body py-4 gap-0">
              <h2 className={`card-title flex justify-center ${index == 0 ? 'text-xl text-center' : 'text-base text-center'}`}>{item[0]}</h2>
              <p className={`text-justify ${index === 0 ? 'max-h-56 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'} transition-all delay-300 ease-linear`}>
                {item[1] && item[1].length > 100 ? `${item[1].substring(0, 150)}...` : item[1]}
              </p>
            </div>
          </div>
          <div className={`card p-4 justify-center items-center ${found && index == 0 ? 'bg-white' : 'bg-white'} shadow-sm flex space-x-4 ${index == 0 ? 'scale-105 ml-4 mb-4' : 'scale-100'}`}>
            {(index != 0 || !found) &&
              <span className={`loading loading-dots loading-md ${index == 0 ? 'text-secondary' : ''}`}></span>
            }
            <div className="avatar-group -space-x-6 rtl:space-x-reverse">
              {found && index == 0 && responseData.employees_to_inform.map((item, index) => (<div className="avatar">
                <div className=" w-8 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
