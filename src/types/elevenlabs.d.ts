// Type declarations for ElevenLabs custom elements
declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      agentId?: string;
      avatarImageUrl?: string;
      avatarOrbColor1?: string;
      avatarOrbColor2?: string;
      actionText?: string;
      customColors?: string;
      autoStart?: boolean;
    };
  }
}

