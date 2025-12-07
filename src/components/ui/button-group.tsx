import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonGroupVariants = cva(
    "inline-flex items-center rounded-full border border-border bg-surface-container-low p-1",
    {
        variants: {
            orientation: {
                horizontal: "flex-row",
                vertical: "flex-col",
            },
        },
        defaultVariants: {
            orientation: "horizontal",
        },
    }
)

interface ButtonGroupProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> { }

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
    ({ className, orientation, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(buttonGroupVariants({ orientation }), className)}
                {...props}
            />
        )
    }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup, buttonGroupVariants }
