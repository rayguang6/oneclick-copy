// app/(root)/projects/[projectId]/tools/[toolSlug]/conversations/[conversationId]/page.tsx
import { getChatMessages } from '@/lib/actions/chats.actions';
import DataRenderer from '@/app/components/DataRenderer';
import StreamingContent from '@/app/components/conversation/StreamingContent';
import { EMPTY_TOOLS } from '@/constants/states';

type RouteParams = {
  params: {
    projectId: string;
    toolSlug: string;
    conversationId: string;
  };
};

const ConversationPage = async ({ params }: RouteParams) => {
  const { projectId, toolSlug, conversationId } = await params;
  const { success, data, error } = await getChatMessages({ conversationId });
  
  const chats = data?.chats || [];
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <DataRenderer
          success={success}
          error={error}
          data={chats}
          empty={EMPTY_TOOLS}
          render={(messages) => (
            <>
              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-50 ml-12' 
                        : 'bg-gray-50 mr-12'
                    }`}
                  >
                    <div className="font-medium mb-2">
                      {message.role === 'user' ? 'You' : 'AI'}
                    </div>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: message.content }} />
                  </div>
                ))}

                {/* Add StreamingContent outside of the map but inside the render function */}
                <StreamingContent />
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
}

export default ConversationPage;