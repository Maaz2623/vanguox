"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="flex h-12  shrink-0 items-center gap-2 transition-[width,height] ease-linear focus-visible:ring-0 focus-visible:outline-none group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              Select Model <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
            {/* Anthropic */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>Anthropic</DropdownMenuLabel>
              <DropdownMenuItem>Claude 4 Sonnet</DropdownMenuItem>
              <DropdownMenuItem>Claude 3.7 Sonnet</DropdownMenuItem>
              <DropdownMenuItem>Claude 3.5 Sonnet</DropdownMenuItem>
              <DropdownMenuItem>Claude 4.1 Opus</DropdownMenuItem>
              <DropdownMenuItem>Claude 4 Opus</DropdownMenuItem>
              <DropdownMenuItem>Claude 3.5 Haiku</DropdownMenuItem>
              <DropdownMenuItem>Claude 3 Haiku</DropdownMenuItem>
              <DropdownMenuItem>Claude 3 Opus</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* OpenAI */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>OpenAI</DropdownMenuLabel>
              <DropdownMenuItem>GPT-5 Nano</DropdownMenuItem>
              <DropdownMenuItem>GPT-5 Mini</DropdownMenuItem>
              <DropdownMenuItem>GPT-5</DropdownMenuItem>
              <DropdownMenuItem>GPT-4o Mini</DropdownMenuItem>
              <DropdownMenuItem>GPT-4o</DropdownMenuItem>
              <DropdownMenuItem>GPT-4.1 Mini</DropdownMenuItem>
              <DropdownMenuItem>GPT-4.1</DropdownMenuItem>
              <DropdownMenuItem>GPT-4.1 Nano</DropdownMenuItem>
              <DropdownMenuItem>GPT-OSS 120B</DropdownMenuItem>
              <DropdownMenuItem>GPT-OSS 20B</DropdownMenuItem>
              <DropdownMenuItem>O3</DropdownMenuItem>
              <DropdownMenuItem>O4 Mini</DropdownMenuItem>
              <DropdownMenuItem>GPT-3.5 Turbo</DropdownMenuItem>
              <DropdownMenuItem>O3 Mini</DropdownMenuItem>
              <DropdownMenuItem>GPT-4 Turbo</DropdownMenuItem>
              <DropdownMenuItem>O1</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Google */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>Google</DropdownMenuLabel>
              <DropdownMenuItem>Gemini 2.0 Flash</DropdownMenuItem>
              <DropdownMenuItem>Gemini 2.5 Flash</DropdownMenuItem>
              <DropdownMenuItem>Gemini 2.5 Pro</DropdownMenuItem>
              <DropdownMenuItem>Gemini 2.5 Flash Lite</DropdownMenuItem>
              <DropdownMenuItem>Gemini 2.0 Flash Lite</DropdownMenuItem>
              <DropdownMenuItem>Gemma 2 9B IT</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* DeepSeek */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>DeepSeek</DropdownMenuLabel>
              <DropdownMenuItem>DeepSeek R1</DropdownMenuItem>
              <DropdownMenuItem>DeepSeek V3.1</DropdownMenuItem>
              <DropdownMenuItem>DeepSeek V3 0324</DropdownMenuItem>
              <DropdownMenuItem>DeepSeek V3.1 Thinking</DropdownMenuItem>
              <DropdownMenuItem>DeepSeek V3.1 Base</DropdownMenuItem>
              <DropdownMenuItem>DeepSeek R1 Distill LLaMA 70B</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Alibaba */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>Alibaba</DropdownMenuLabel>
              <DropdownMenuItem>Qwen3 32B</DropdownMenuItem>
              <DropdownMenuItem>Qwen3 235B A22B Instruct 2507</DropdownMenuItem>
              <DropdownMenuItem>Qwen3 30B A3B</DropdownMenuItem>
              <DropdownMenuItem>Qwen3 14B</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Others (shortened for UX) */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>Others</DropdownMenuLabel>
              <DropdownMenuItem>Kimi K2</DropdownMenuItem>
              <DropdownMenuItem>GLM 4.5</DropdownMenuItem>
              <DropdownMenuItem>GLM 4.5 Air</DropdownMenuItem>
              <DropdownMenuItem>LLaMA 3 / 4 Series</DropdownMenuItem>
              <DropdownMenuItem>Grok Series</DropdownMenuItem>
              <DropdownMenuItem>Mistral Models</DropdownMenuItem>
              <DropdownMenuItem>Perplexity Sonar</DropdownMenuItem>
              <DropdownMenuItem>Bedrock Nova</DropdownMenuItem>
              <DropdownMenuItem>Cohere Command</DropdownMenuItem>
              <DropdownMenuItem>Vercel v0</DropdownMenuItem>
              <DropdownMenuItem>Morph V3</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
