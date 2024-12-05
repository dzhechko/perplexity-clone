"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Globe } from 'lucide-react';
import type { SearchProvider } from '@/types/search';

interface ProviderSelectorProps {
  provider: SearchProvider;
  onProviderChange: (provider: SearchProvider) => void;
}

const providers = {
  exa: { icon: Sparkles, label: 'Exa.ai' },
  serper: { icon: Globe, label: 'Serper.dev' }
};

export function ProviderSelector({ provider, onProviderChange }: ProviderSelectorProps) {
  const Icon = providers[provider].icon;

  return (
    <Select value={provider} onValueChange={(value: SearchProvider) => onProviderChange(value)}>
      <SelectTrigger className="w-[140px]" aria-label="Select search provider">
        <Icon className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select provider" defaultValue={provider}>
          {providers[provider].label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(providers).map(([key, { icon: ItemIcon, label }]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center">
              <ItemIcon className="mr-2 h-4 w-4" />
              {label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}