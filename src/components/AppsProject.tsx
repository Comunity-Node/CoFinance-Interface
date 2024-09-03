'use client';
import React from 'react';
import projectData from '../data/network.json'; 
import Link from 'next/link';
import Image from 'next/image';
import '../app/globals.css'; // Adjust path to your global CSS or CSS module

interface Project {
    name: string;
    description: string;
    image: string;
    website: string;
}

const AppsProject = () => {
    const featuredProjects = projectData.projects;

    return (
        <div className="relative py-12">
            <div className="absolute inset-0 BackgroundGradient z-[-1]"></div>
            <div className="relative">
                <div className="text-center">
                    <p className="my-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                        Explore Our Service
                    </p>
                </div>
                <div className="mt-10 mx-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center card-container">
                        {featuredProjects.map((project: Project, index: number) => (
                            <div key={index} className="flex justify-center">
                                <div className="relative flex flex-col rounded-lg bg-transparent shadow-lg overflow-hidden h-full max-w-sm p-1 card">
                                    <div className="relative p-1 sm:p-6 flex flex-col items-center text-center flex-grow bg-transparent">
                                        <Image
                                            src={project.image}
                                            alt={project.name}
                                            height={300} 
                                            width={250}  
                                            className="object-contain rounded-lg" 
                                        />
                                        <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">{project.name}</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">{project.description}</p>
                                        <Link href={project.website} className='mt-2 text-teal-600 hover:underline'>
                                            Launch
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppsProject;
