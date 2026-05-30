const menuItems = [
  '首頁',
  '協會介紹',
  '入會指南',
  '活動日曆',
  '資源中心',
  '公告資訊',
  '幫助中心',
];

const languages = ['繁中', 'Português', 'EN'];

function LogoPlaceholder() {
  return (
    <a className="block" href="#" aria-label="澳門直播協會 · 小揚同學">
      <img
        className="h-[64px] w-auto select-none object-contain"
        src="/logo-nav.png"
        alt="澳門直播協會 · 小揚同學"
        draggable="false"
      />
    </a>
  );
}

function NavLink({ children, active = false, href = "#" }) {
  return (
    <a
      className={[
        'relative flex h-full items-center px-[18px] text-[13.5px] leading-none tracking-normal transition-colors',
        active
          ? 'font-semibold text-[#005d50]'
          : 'font-semibold text-[#555f68] hover:text-[#004f46]',
      ].join(' ')}
      href={href}
    >
      {children}
      {active ? (
        <span className="absolute bottom-[17px] left-1/2 h-[3px] w-[42px] -translate-x-1/2 rounded-full bg-macau-deep shadow-[0_1px_0_rgba(0,93,80,0.12)]" />
      ) : null}
    </a>
  );
}

function LanguageSwitch() {
  return (
    <div className="ml-auto flex h-full items-center whitespace-nowrap text-[13.5px] font-semibold leading-none tracking-normal text-[#555f68]">
      {languages.map((language, index) => (
        <span className="flex items-center" key={language}>
          <button
            className={[
              'px-[9px] transition-colors hover:text-[#004f46]',
              language === '繁中' ? 'font-semibold text-[#005d50]' : '',
            ].join(' ')}
            type="button"
          >
            {language}
          </button>
          {index < languages.length - 1 ? <span className="text-[#8b9298]">/</span> : null}
        </span>
      ))}
    </div>
  );
}

export default function HeaderNav() {
  const currentPath = window.location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="h-[92px] rounded-b-[9px] border border-white/90 bg-white px-[32px] shadow-nav">
        <div className="mx-auto flex h-full max-w-[1535px] items-center">
          <div className="shrink-0">
            <LogoPlaceholder />
          </div>

          <nav className="ml-[68px] hidden h-full items-center xl:flex" aria-label="主導航">
            {menuItems.map((item, index) => {
              const itemHrefs = {
                '首頁': '/',
                '協會介紹': '/about',
                '入會指南': '/guide',
                '活動日曆': '/calendar',
              };
              const itemPath = itemHrefs[item] || "#";
              const isActive = itemPath !== "#" && currentPath === itemPath;
              return (
                <NavLink active={isActive} key={item} href={itemPath}>
                  {item}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden h-full flex-1 items-center xl:flex">
            <LanguageSwitch />
          </div>

          <button
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-macau-line bg-white/80 text-macau-deep shadow-sm xl:hidden"
            type="button"
            aria-label="打開菜單"
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className="h-0.5 rounded-full bg-current" />
              <span className="h-0.5 rounded-full bg-current" />
              <span className="h-0.5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
