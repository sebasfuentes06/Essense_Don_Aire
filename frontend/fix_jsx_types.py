from pathlib import Path
import re

root = Path(r"C:\Users\User\Desktop\Proyecto_Figma\frontend\src")
folders = [
    root / "Features" / "components" / "ui",
    root / "shared" / "components" / "ui",
    root / "Features" / "components" / "layout",
    root / "Features" / "components" / "dashboard",
]

patterns = [
    (r'\bimport\s+\{\s*type\s+[^}]+\}\s+from\s+["\'][^"\']+["\'];?\n?', ''),
    (r'\btype\s+[A-Za-z_]\w*(?:\s*<[^>]+>)?\s*=\s*.*?;\s*', ''),
    (r'\binterface\s+[A-Za-z_]\w*\s*\{.*?\}\s*', ''),
    (r'\b(?:as\s+const|as\s+[A-Za-z_][A-Za-z0-9_<>\[\]\|&\s\.\"\'\?]+)', ''),
    (r'\bReact\.createContext\s*<[^>]+>\s*\(', 'React.createContext('),
    (r'\bReact\.useState\s*<[^>]+>\s*\(', 'React.useState('),
    (r'\bReact\.useMemo\s*<[^>]+>\s*\(', 'React.useMemo('),
    (r'\bReact\.useCallback\s*<[^>]+>\s*\(', 'React.useCallback('),
    (r'\bReact\.useContext\s*<[^>]+>\s*\(', 'React.useContext('),
    (r'\bReact\.useId\s*<[^>]+>\s*\(', 'React.useId('),
    (r':\s*&\s*\{[^)]*\}\s*\)', ')'),
    (r':\s*\{[^)]*\}\s*\)', ')'),
    (r':\s*(?:[A-Za-z_]\w*Props|CarouselProps|ChartContextProps|FormFieldContextValue|FormItemContextValue|SidebarContextProps|SidebarMenuButtonProps|DropdownMenuItemProps|MenuBarItemProps|DialogProps|PopoverProps|TooltipProps)\s*\)', ')'),
    (r':\s*\)\s*\{', ') {'),
    (r':\s*\)\s*=>', ') =>'),
    (r'\}\s*:\s*\w+\s*\)', '})'),
    (r'\}\s*:\s*\w+\s*\}', '}'),
    (r'\}\s*:\s*\w+\s*=>', '} =>'),
]

for folder in folders:
    for path in folder.glob('*.*'):
        text = path.read_text(encoding='utf-8')
        original = text
        for pattern, repl in patterns:
            text = re.sub(pattern, repl, text, flags=re.S)
        text = text.replace('const THEMES = { light: "", dark: ".dark" } as const;', 'const THEMES = { light: "", dark: ".dark" };')
        text = text.replace('const ToggleGroupContext = React.createContext<\n  \n>({', 'const ToggleGroupContext = React.createContext({')
        text = text.replace('const ChartContext = React.createContext<ChartContextProps | null>(null);', 'const ChartContext = React.createContext(null);')
        text = text.replace('export     icon?: ;', '')
        text = text.replace('}:  & )', '})')
        text = text.replace('}: )', '})')
        text = text.replace('}:', '}')
        text = text.replace('} as ', '}')
        text = text.replace('React.createContext(null);\n\n', 'React.createContext(null);\n')
        if text != original:
            path.write_text(text, encoding='utf-8')
            print(f'updated {path}')

# direct files with obvious leftover TS syntax
for path in [
    root / 'Features' / 'components' / 'dashboard' / 'StatCard.jsx',
    root / 'Features' / 'components' / 'layout' / 'Navbar.jsx',
    root / 'Features' / 'components' / 'layout' / 'Sidebar.jsx',
    root / 'Features' / 'components' / 'ui' / 'DeleteDialog.jsx',
    root / 'Features' / 'components' / 'ui' / 'FilterPanel.jsx',
    root / 'Features' / 'components' / 'ui' / 'ItemsPerPageSelect.jsx',
    root / 'Features' / 'components' / 'ui' / 'Modal.jsx',
    root / 'Features' / 'components' / 'ui' / 'Pagination.jsx',
    root / 'Features' / 'components' / 'ui' / 'SortSelect.jsx',
    root / 'Features' / 'components' / 'ui' / 'sonner.jsx',
]:
    if path.exists():
        text = path.read_text(encoding='utf-8')
        text = re.sub(r':\s*\w+Props\s*\)', ')', text)
        text = text.replace('}:', '}')
        text = re.sub(r'\s+as\s+[A-Za-z_\[\]\|\"\'\?\s<>]+', '', text)
        text = text.replace('type ', '')
        text = text.replace('interface ', '')
        path.write_text(text, encoding='utf-8')
        print(f'normalized {path}')
