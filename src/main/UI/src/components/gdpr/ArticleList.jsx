import { useTheme } from '../../context/ThemeContext';

import { useQuery } from '@tanstack/react-query';

import { gdprService } from '../../services/gdprService';

import ArticleSearch from './ArticleSearch';

import { useState } from 'react';

import toast from 'react-hot-toast';



export default function ArticleList() {

    const { theme } = useTheme();

    const [searchTerm, setSearchTerm] = useState('');

    const { data: articles, isLoading } = useQuery({

        queryKey: ['articles', searchTerm],

        queryFn: () => searchTerm ? gdprService.searchArticles(searchTerm) : gdprService.getAllArticles(),

    });



    const handleSaveArticle = async (articleId) => {

        try {

            await gdprService.saveArticle(articleId);

            toast.success('Article saved successfully');

        } catch (error) {

            toast.error('Failed to save article');

        }

    };



    if (isLoading) {

        return <div className="flex justify-center items-center h-64">Loading articles...</div>;

    }



    return (

        <div className="space-y-6">

            <div className="mb-6">

                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mb-4`}>

                    GDPR Articles

                </h2>

                <ArticleSearch onSearch={setSearchTerm} />

            </div>



            <div className="space-y-4">

                {articles?.map((article) => (

                    <div key={article.id} 

                         className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} 

                                   shadow rounded-lg p-6`}>

                        <div className="flex justify-between items-start">

                            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>

                                {article.articleNumber}

                            </h3>

                            <button

                                onClick={() => handleSaveArticle(article.id)}

                                className={`${theme === 'dark' 

                                    ? 'bg-indigo-900 text-indigo-100 hover:bg-indigo-800' 

                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'} 

                                    px-3 py-1 rounded-md text-sm`}

                            >

                                Save Article

                            </button>

                        </div>

                        <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mt-2`}>

                            {article.title}

                        </h4>

                        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>

                            {article.content}

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}