import { useQuery } from '@tanstack/react-query';
import { gdprService } from '../../services/gdprService';
import { useTheme } from '../../context/ThemeContext';

export default function SavedArticles() {
    const { theme } = useTheme();
    const { data: savedArticles, isLoading } = useQuery({
        queryKey: ['savedArticles'],
        queryFn: () => gdprService.getSavedArticles(),
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading saved articles...</div>;
    }

    return (
        <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Saved Articles
            </h3>
            {savedArticles?.map((article) => (
                <div key={article.id} 
                     className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-4`}>
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        Article {article.articleNumber}
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        {article.title}
                    </p>
                </div>
            ))}
        </div>
    );
}