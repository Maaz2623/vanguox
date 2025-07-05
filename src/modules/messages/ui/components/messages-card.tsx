import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";
import { Typewriter } from "react-simple-typewriter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "../../../../../prisma/generated/prisma";

interface MessagesCardProps {
  role: "USER" | "ASSISTANT";
  content: string;
  isTypewriter?: boolean;
  keywords: string[];
  summary: string;
}

export const MessagesCard = ({
  role,
  content,
  isTypewriter = false,
  keywords,
  summary,
}: MessagesCardProps) => {
  if (role === "USER") {
    return <UserMessage content={content} />;
  } else {
    return (
      <AssistantMessage
        keywords={keywords}
        content={summary}
        isTypewriter={isTypewriter}
      />
    );
  }
};

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="w-full flex justify-end text-[16px]">
      <Card className="shadow-none w-fit max-w-[60%] p-4 bg-[#3e4bbb] text-white border-none">
        {content}
      </Card>
    </div>
  );
};

const AssistantMessage = ({
  content,
  isTypewriter,
  keywords,
}: {
  content: string;
  isTypewriter?: boolean;
  keywords: string[];
}) => {
  const trpc = useTRPC();

  const { data: products } = useQuery(
    trpc.product.getMany.queryOptions({
      keywords: keywords,
    })
  );
  return (
    <div
      className={cn("flex flex-col group px-2 pb-4 max-w-[70%] text-[16px]")}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src={`/logo.svg`}
          alt="vibe"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Vanguox</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 font-medium">
          {format(Date.now(), "HH:mm 'on' MM dd, yyyy")}
        </span>
      </div>
      <div className="w-full flex justify-start flex-col gap-y-2">
        <Card className="shadow-none bg-sidebar w-fit p-5 border-none animate-fade-in">
          {isTypewriter ? (
            <Typewriter typeSpeed={10} words={[content]} />
          ) : (
            <p>{content}</p>
          )}
        </Card>
        <div className="w-full flex justify-center items-center border">
          <ProductsCarousel products={products} />
        </div>
      </div>
    </div>
  );
};

const ProductsCarousel = ({ products }: { products?: Product[] }) => {
  if (!products) {
    return <div>Fetching Products</div>;
  }
  return (
    <Carousel>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="border flex justify-center items-center"
          >
            <Card className="shadow-none h-[200px] w-[150px] rounded-sm bg-sidebar  p-5 border-none animate-fade-in">
              {product.title}
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
