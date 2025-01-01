import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  ClipboardCheck, 
  FileText,
  CalendarClock,
  Kanban,
  LineChart,
  ChevronDown,
  Eye,
  Brain,
  BookOpen
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isOKRMenuOpen, setIsOKRMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOKRMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavItemClass = (path: string) => `
    flex items-center space-x-2 px-4 py-2 rounded-lg
    ${location.pathname === path ? 'bg-violet-500/10 text-violet-400' : 'text-gray-400 hover:bg-violet-500/5 hover:text-violet-400'}
    transition-colors
  `;

  return (
    <nav className="bg-[#1C1D24] border-b border-[#2D2E3A] px-6 py-2">
      <div className="flex space-x-6">
        {/* Onglets historiques */}
        <Link to="/" className={getNavItemClass('/')}>
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link to="/kpis" className={getNavItemClass('/kpis')}>
          <BarChart2 className="h-5 w-5" />
          <span className="font-medium">KPIs</span>
        </Link>

        <Link to="/audit" className={getNavItemClass('/audit')}>
          <ClipboardCheck className="h-5 w-5" />
          <span className="font-medium">Audit</span>
        </Link>

        <Link to="/actions" className={getNavItemClass('/actions')}>
          <FileText className="h-5 w-5" />
          <span className="font-medium">Liste Complète</span>
        </Link>

        <Link to="/project-plan" className={getNavItemClass('/project-plan')}>
          <CalendarClock className="h-5 w-5" />
          <span className="font-medium">Project Plan</span>
        </Link>

        <Link to="/simulator" className={getNavItemClass('/simulator')}>
          <LineChart className="h-5 w-5" />
          <span className="font-medium">Simulateur</span>
        </Link>

        {/* Menu parent OKR Tools */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOKRMenuOpen((prev) => !prev)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg
              ${location.pathname.startsWith('/okr-tools') ? 'bg-violet-500/10 text-violet-400' : 'text-gray-400 hover:bg-violet-500/5 hover:text-violet-400'}
              transition-colors
            `}
          >
            <Kanban className="h-5 w-5" />
            <span className="font-medium">OKR Tools</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOKRMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOKRMenuOpen && (
            <div className="absolute left-0 mt-1 w-52 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg shadow-lg py-1 z-10">
              <Link 
                to="/okr-tools/vision" 
                className={`${getNavItemClass('/okr-tools/vision')} block`}
                onClick={() => setIsOKRMenuOpen(false)}
              >
                <Eye className="h-5 w-5" />
                <span className="font-medium">Vision</span>
              </Link>

              <Link 
                to="/okr-tools/okr" 
                className={`${getNavItemClass('/okr-tools/okr')} block`}
                onClick={() => setIsOKRMenuOpen(false)}
              >
                <Brain className="h-5 w-5" />
                <span className="font-medium">OKR</span>
              </Link>

              <Link 
                to="/okr-tools/project-plan" 
                className={`${getNavItemClass('/okr-tools/project-plan')} block`}
                onClick={() => setIsOKRMenuOpen(false)}
              >
                <Kanban className="h-5 w-5" />
                <span className="font-medium">Project Plan OKR</span>
              </Link>

              <Link 
                to="/okr-tools/memory" 
                className={`${getNavItemClass('/okr-tools/memory')} block`}
                onClick={() => setIsOKRMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Memory</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;