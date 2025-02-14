import TarotMasterList from './TarotMasterList'
import ClientSidebar from './ClientSidebar'
import SessionList from './SessionList';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  return (
    <ClientSidebar isOpen={isOpen} setIsOpen={setIsOpen}>
      <TarotMasterList />
      <SessionList />
    </ClientSidebar>
  )
}