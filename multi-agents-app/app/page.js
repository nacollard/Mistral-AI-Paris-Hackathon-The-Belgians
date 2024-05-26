'use client'

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [waiting, setWaiting] = useState([['New AI technology promises to revolutionize the IT industry', 'A new and highly advanced artificial intelligence (AI) technology has been unveiled by a leading tech company, and experts and analysts are predicting that it will have a major and transformative impact on the IT industry.', 'news'],]);
  const [found, setFound] = useState(false);
  const [urgency, setUrgency] = useState('low');
  const [dataQueue, setDataQueue] = useState([
    ['The future of AI in the IT industry', 'Artificial intelligence (AI) is a rapidly evolving field that is poised to have a major impact on the IT industry. In this article, we take a look at some of the key trends and developments that are shaping the future of AI in IT.', 'law'],
    ['How AI is changing the face of the IT industry', 'Artificial intelligence (AI) is revolutionizing the IT industry, with a wide range of applications that are transforming the way businesses operate. In this article, we explore some of the ways that AI is changing the face of the IT industry.', 'social'],
    ['The rise of AI in the IT industry', 'Artificial intelligence (AI) is becoming increasingly important in the IT industry, with a growing number of companies using AI technologies to improve their operations and drive innovation. In this article, we take a look at some of the key trends and developments that are shaping the rise of AI in the IT industry.', 'news'],
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

      const urgencies = ['high', 'medium', 'low'];
      const randomIndex = Math.floor(Math.random() * urgencies.length);
      const randomUrgency = urgencies[randomIndex];
      setUrgency(randomUrgency);

      if (randomUrgency == 'high') {
        await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: 'Multi Agent App',
            content: JSON.stringify(result),
          }),
        });
      }

      setFound(true);

      setTimeout(() => {
        setWaiting(prev => prev.filter((item, index) => index != 0));
        setFound(false);
      }, 3000);
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

  const handleIconClick = (itemIndex) => {
    const urgencies = ['high', 'medium', 'low'];
    const randomIndex = Math.floor(Math.random() * urgencies.length);
    const randomUrgency = urgencies[randomIndex];
    setUrgency(randomUrgency);
    setFound(true);

    setTimeout(() => {
      setWaiting(prev => prev.filter((item, index) => index != itemIndex));
      setFound(false);
    }, 3000);
  };

  return (
    <main className="container mx-auto flex flex-col-reverse justify-center items-center gap-6">
      {found &&
        <div className="toast toast-top toast-center">
          {urgency == 'low' &&
            <div role="alert" className="alert alert-info text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Mail (non-urgent) sent to julie@example.com</span>
            </div>
          }

          {urgency == 'medium' &&
            <div role="alert" className="alert alert-success text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Mail sent to julie@example.com</span>
            </div>
          }

          {urgency == 'high' &&
            <div role="alert" className="alert alert-error text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Mail (urgent) sent to julie@example.com</span>
            </div>
          }
        </div>
      }
      {waiting.map((item, index) => (
        <div key={index} className={`flex gap-4 transition-all duration-500 ease-in-out ${index < waiting.length - 1 ? '-translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <div className={`card ml-4 p-4 justify-center items-center bg-white shadow-sm flex space-x-4 ${index == 0 ? 'scale-105 mr-4 mb-4' : 'scale-100'}`} onClick={() => handleIconClick(index)}>
            <svg className="fill-neutral cursor-pointer" height="30px" viewBox="0 -960 960 960" width="30px">
              {item[2] == 'news' &&
                <path d="M146.67-120q-27.5 0-47.09-19.58Q80-159.17 80-186.67V-840l67 67 66-67 67 67 67-67 66 67 67-67 67 67 66-67 67 67 67-67 66 67 67-67v653.33q0 27.5-19.58 47.09Q840.83-120 813.33-120H146.67Zm0-66.67h300v-266.66h-300v266.66Zm366.66 0h300v-100h-300v100Zm0-166.66h300v-100h-300v100ZM146.67-520h666.66v-120H146.67v120Z" />
              }
              {item[2] == 'law' &&
                <path d="M160-120v-66.67h480V-120H160Zm223.33-206L160-549.33 234.67-626 460-402.67 383.33-326Zm254-254L414-805.33 490.67-880 714-656.67 637.33-580Zm196 420L302-691.33 348.67-738 880-206.67 833.33-160Z" />
              }
              {item[2] == 'social' &&
                <path d="m239.33-160 40-159.33H120L136.67-386H296l47.33-188H184l16.67-66.67H360L399.33-800h66L426-640.67h188.67L654-800h66l-39.33 159.33H840L823.33-574H664l-47.33 188H776l-16.67 66.67H600L560-160h-66l40-159.33H345.33l-40 159.33h-66ZM362-386h188.67L598-574H409.33L362-386Z" />
              }
            </svg>
          </div>
          <div className={`card w-96 bg-white shadow-sm transition-all duration-300 ease-in-out ${index == 0 ? 'scale-105 shadow-2xl mb-4' : 'scale-100 shadow-none'}`}>
            <div className="group card-body py-4 gap-0">
              <h2 className="card-title text-center">{item[0]}</h2>
              <p className={`text-justify ${index == 0 ? 'max-h-56 opacity-100 mt-2' : ' max-h-0 opacity-0 mt-0'} transition-all delay-300 ease-linear`}>{item[1]}</p>
            </div>
          </div>
          <div className={`card p-4 justify-center items-center ${found && index == 0 ? 'bg-white' : 'bg-white'} shadow-sm flex space-x-4 ${index == 0 ? 'scale-105 ml-4 mb-4' : 'scale-100'}`}>
            {(index != 0 || !found) &&
              <span className={`loading loading-dots loading-md ${index == 0 ? 'text-secondary' : ''}`}></span>
            }
            {found && index == 0 &&
              <div className="avatar">
                <div className=" w-8 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>
            }
          </div>
        </div>
      ))}
    </main>
  );
}
