
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

type TooltipProps = {
  children: React.ReactNode;
  text: string;
};

const Tooltip = ({ children, text }: TooltipProps) => {
  return (
    <div className="relative">
      {children}
      <div className="group inline-block">
        <QuestionMarkCircleIcon className="ml-1 h-4 w-4 text-black dark:text-white" />
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
          {text}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;