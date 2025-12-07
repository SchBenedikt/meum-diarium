import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SplitButtonProps extends ButtonProps {
    onMainClick?: () => void
    menuContent: React.ReactNode
    label: React.ReactNode
}

const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(
    ({ className, onMainClick, menuContent, label, variant = "default", size = "default", ...props }, ref) => {
        return (
            <div className={cn("inline-flex -space-x-[1px] rounded-full ", className)}>
                <Button
                    ref={ref}
                    variant={variant}
                    size={size}
                    className="rounded-e-none rounded-s-full border-r-[1px] border-r-white/20 focus-visible:z-10"
                    onClick={onMainClick}
                    {...props}
                >
                    {label}
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={variant}
                            size="icon"
                            className="rounded-s-none rounded-e-full w-[calc(var(--spacing)*9)] px-2 focus-visible:z-10"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {menuContent}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }
)
SplitButton.displayName = "SplitButton"

export { SplitButton }
