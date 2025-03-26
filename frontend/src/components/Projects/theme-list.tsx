import ThemeCard from "./theme-card";

type ThemeListProps = {
    themes: string[];
};

const ThemeList = ( {themes} : ThemeListProps ) => {
    console.log("Themes", themes);
    return (
        <div className="flex flex-col gap-2">
            <span className="min-w-[125px]">Relevant Themes</span>
            {
                themes.map((theme, index) => (
                    <ThemeCard key={index} theme={theme} />
                ))
            }
        </div>
    );
}

export default ThemeList;