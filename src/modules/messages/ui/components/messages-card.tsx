import { Card } from "@/components/ui/card";

interface MessagesCardProps {
  type: "USER" | "ASSISTANT";
}

export const MessagesCard = ({ type }: MessagesCardProps) => {
  if (type === "USER") {
    return <UserMessage />;
  } else {
    return <AssistantMessage />;
  }
};

const UserMessage = () => {
  return (
    <div className="w-full flex justify-end">
      <Card className="shadow-none w-fit max-w-[60%] px-3 py-2 bg-[#3e4bbb] text-white border-none">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa voluptatum
        ducimus tempore molestiae reprehenderit nihil aperiam accusamus, animi
        rerum quos. Voluptas dolorum maxime esse. Reprehenderit voluptatum culpa
        repudiandae totam unde?
      </Card>
    </div>
  );
};

const AssistantMessage = () => {
  return (
    <div className="w-full flex justify-start">
      <Card className="shadow-none bg-sidebar w-fit max-w-[80%] px-3 py-2 border-none">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ad et
        sint velit, error eius itaque eligendi, maiores iure illo dicta
        assumenda fugiat mollitia, esse corporis adipisci voluptatum. Ut numquam
        sint quibusdam enim, iste pariatur unde sed ratione sit. Necessitatibus!
      </Card>
    </div>
  );
};
