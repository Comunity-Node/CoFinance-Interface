'use client';
import React from 'react';
import projectData from '../data/network.json';
import Link from 'next/link';

interface Project {
    name: string;
    description: string;
    image: string;
    website: string;
}

const AppsProject = () => {
    const featuredProjects = projectData.projects;

    return (
        <section className="p-10">
            <div className="flex flex-row-reverse gap-8 items-center justify-between rounded-xl max-w-screen px-10 bg-explore shadow-md shadow-gray-800">
                <div className="text-end" data-aos="fade-left">
                    <p className='text-gray-600 text-xl uppercase'>Technology</p>
                    <p className="py-2 text-4xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                        Explore Our Services
                    </p>
                    <p className="text-sm font-normal text-gray-400">Lorem ipsum sit dolor amet.</p>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center py-10">
                    {featuredProjects.map((project: Project, index: number) => (
                        <div key={index} className="card bg-black w-96 shadow-xl hover:bg-custom-radial-gradient" data-aos="fade-up">
                            <div className="h-0 pt-5 px-5 space-y-4 z-50">
                                <p className="text-2xl font-semibold ">{project.name}</p>
                                <p className='text-sm font-medium text-gray-500 w-full limit-text'>
                                    {project.description}
                                </p>
                                <Link href={project.website} className='btn btn-sm glass rounded-md px-10'>Launch</Link>
                            </div>
                            <figure>
                                <img className='object-cover w-full'
                                    src={project.image}
                                    alt={project.name} />
                            </figure>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}

export default AppsProject;
