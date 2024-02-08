import { ChangeEvent, useState } from "react"
import logo from "./assets/Logo.svg"
import { NewCard } from "./components/new-card"
import { NoteCard } from "./components/note-card"
import { toast } from "sonner"

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [notes, setNotes] = useState<Note[]>(() =>{ 
    const notesOnStorage = localStorage.getItem('notes');

    if(notesOnStorage){
      return JSON.parse(notesOnStorage);
    }

    return([])

  })
  const [search, setSearch] = useState<string>('');
  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  function onNoteCreated(content: string){
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }
    const notesArray = [newNote, ...notes];
    
    setNotes([newNote, ...notes]);

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
    toast.error("Nota deletada com sucesso!")
  }
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0">
      <img src={logo} alt="NLW Expert" />
      <form className="w-full">
        <input 
          type="text"
          placeholder="Busque suas notas..." 
          onChange={handleSearch}
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder: outline-none text-slate-500"
        />
      </form>
      <div className="h-px bg-slate-700"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map(note => {
          return(<NoteCard key={note.id} onNoteDeleted={onNoteDeleted} note={note}/>)
        })}
      </div>
    </div>  
  )
}

