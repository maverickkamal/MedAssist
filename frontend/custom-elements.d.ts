declare namespace JSX {
    interface IntrinsicElements {
      'l-quantum': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        size?: string;
        speed?: string;
        color?: string;
      }, HTMLElement>;
    }
}