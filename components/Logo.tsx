// components/Logo.tsx

interface LogoProps {
    size?: "sm" | "md" | "lg"
    showText?: boolean
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
    const dimensions = {
        sm: "h-6 w-auto",
        md: "h-8 w-auto",
        lg: "h-12 w-auto"
    }

    const textSizes = {
        sm: "text-sm",
        md: "text-xl",
        lg: "text-3xl"
    }

    return (
        <div className="flex items-center gap-2">
            {/* Логотип cdek_digital */}
            <img
                src="/cdek_digital.svg"
                alt="cdek_digital"
                className={`${dimensions[size]} object-contain`}
            />

            {/* Текст */}
            {showText && (
                <div className="flex flex-col">
                    <span className={`${textSizes[size]} font-bold text-zinc-100 leading-tight`}>
                        cdek_digital
                    </span>
                    <span className="text-xs text-zinc-500 leading-tight">
                        IT Solutions
                    </span>
                </div>
            )}
        </div>
    )
}