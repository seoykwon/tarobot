import TarotMasterList from './TarotMasterList'
import ClientSidebar from './ClientSidebar'

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  return (
    <ClientSidebar isOpen={isOpen} setIsOpen={setIsOpen}>
      <TarotMasterList />
    </ClientSidebar>
  )
}