'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui-components/react/popover';
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  type Transition,
} from 'motion/react';

import { cn } from '@/lib/utils';

type Side = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Positioner
>['side'];

type Align = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Positioner
>['align'];

const getInitialPosition = (side: Side) => {
  switch (side) {
    case 'top':
      return { y: 15 };
    case 'bottom':
      return { y: -15 };
    case 'left':
    case 'inline-start':
      return { x: 15 };
    case 'right':
    case 'inline-end':
      return { x: -15 };
  }
};

type PopoverContextType = {
  isOpen: boolean;
  side?: Side;
  setSide?: (side: Side) => void;
};

const PopoverContext = React.createContext<PopoverContextType | undefined>(
  undefined,
);

const usePopover = (): PopoverContextType => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopover must be used within a Popover');
  }
  return context;
};

type PopoverProps = React.ComponentProps<typeof PopoverPrimitive.Root>;

function Popover(props: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(
    props?.open ?? props?.defaultOpen ?? false,
  );

  React.useEffect(() => {
    if (props?.open !== undefined) setIsOpen(props.open);
  }, [props?.open]);

  const handleOpenChange = React.useCallback(
    (
      open: boolean,
      event: Event | undefined,
      reason: Parameters<NonNullable<PopoverProps['onOpenChange']>>[2],
    ) => {
      setIsOpen(open);
      props.onOpenChange?.(open, event, reason);
    },
    [props],
  );

  return (
    <PopoverContext.Provider value={{ isOpen }}>
      <PopoverPrimitive.Root
        data-slot="popover"
        {...props}
        onOpenChange={handleOpenChange}
      />
    </PopoverContext.Provider>
  );
}

type PopoverTriggerProps = React.ComponentProps<
  typeof PopoverPrimitive.Trigger
>;

function PopoverTrigger(props: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

type PopoverContentProps = Omit<
  React.ComponentProps<typeof PopoverPrimitive.Positioner>,
  'render'
> & {
  transition?: Transition;
  popupProps?: typeof PopoverPrimitive.Popup;
  motionProps?: HTMLMotionProps<'div'>;
  positionerClassName?: string;
};

function PopoverContent({
  children,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  className,
  positionerClassName,
  popupProps,
  motionProps,
  transition = { type: 'spring', stiffness: 300, damping: 25 },
  ...props
}: PopoverContentProps) {
  const { isOpen } = usePopover();
  const initialPosition = getInitialPosition(side);

  return (
    <AnimatePresence>
      {isOpen && (
        <PopoverPrimitive.Portal keepMounted data-slot="popover-portal">
          <PopoverPrimitive.Positioner
            data-slot="popover-positioner"
            align={align}
            side={side}
            sideOffset={sideOffset}
            className={cn('z-50', positionerClassName)}
            {...props}
          >
            <PopoverPrimitive.Popup
              data-slot="popover-popup"
              {...popupProps}
              className={cn(
                'w-72 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-hidden',
                className,
              )}
              render={
                <motion.div
                  key="popover-content"
                  initial={{ opacity: 0, scale: 0.5, ...initialPosition }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, ...initialPosition }}
                  transition={transition}
                  {...motionProps}
                />
              }
            >
              {children}
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  usePopover,
  type PopoverContextType,
  type PopoverProps,
  type PopoverTriggerProps,
  type PopoverContentProps,
  type Side,
  type Align,
};
