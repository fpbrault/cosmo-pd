import { useState } from "react";
import InlineNotice from "@/components/feedback/InlineNotice";
import Button from "@/components/ui/Button";
import type { Playlist } from "@/lib/collections/playlistManager";

interface SetlistsSidebarProps {
	playlists: Playlist[];
	selectedPlaylistId: string | null;
	onSelectPlaylist: (playlistId: string) => void;
	onCreatePlaylist: () => void;
	onRenamePlaylist: (playlistId: string, name: string) => void;
	onDeletePlaylist: (playlistId: string) => void;
}

export default function SetlistsSidebar({
	playlists,
	selectedPlaylistId,
	onSelectPlaylist,
	onCreatePlaylist,
	onRenamePlaylist,
	onDeletePlaylist,
}: SetlistsSidebarProps) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");

	const startEdit = (playlist: Playlist) => {
		setEditingId(playlist.id);
		setEditingName(playlist.name);
	};

	const commitEdit = (playlistId: string) => {
		if (editingName.trim()) {
			onRenamePlaylist(playlistId, editingName.trim());
		}
		setEditingId(null);
	};

	return (
		<aside className="w-[24rem] min-w-[20rem] overflow-auto border-base-content/10 border-r bg-base-200/70 p-4">
			<div className="mb-4 flex flex-col gap-2">
				<Button variant="accent" onClick={onCreatePlaylist}>
					New Setlist
				</Button>
			</div>

			<div className="space-y-2">
				{playlists.length === 0 && (
					<InlineNotice
						message="No setlists yet. Create one to get started."
						tone="neutral"
					/>
				)}
				{playlists.map((playlist) => (
					<div
						key={playlist.id}
						className={
							"w-full rounded-lg border p-3 text-left transition-colors" +
							(selectedPlaylistId === playlist.id
								? "border-primary/60 bg-base-100"
								: "border-base-content/10 bg-base-200 hover:bg-base-100/60")
						}
					>
						{editingId === playlist.id ? (
							<div className="flex gap-1">
								<input
									className="input input-xs grow"
									value={editingName}
									onChange={(e) => setEditingName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") commitEdit(playlist.id);
										if (e.key === "Escape") setEditingId(null);
									}}
									onBlur={() => commitEdit(playlist.id)}
								/>
							</div>
						) : (
							<Button
								type="button"
								unstyled
								className="w-full text-left"
								onClick={() => onSelectPlaylist(playlist.id)}
							>
								<div className="truncate font-bold text-sm">
									{playlist.name}
								</div>
								<div className="text-xs opacity-70">
									{playlist.entries.length} preset
									{playlist.entries.length !== 1 ? "s" : ""}
								</div>
							</Button>
						)}
						<div className="mt-1 flex justify-end gap-1">
							<Button
								variant="neutral"
								size="sm"
								onClick={() => startEdit(playlist)}
								title="Rename"
							>
								✎
							</Button>
							<Button
								variant="error"
								size="sm"
								onClick={() => onDeletePlaylist(playlist.id)}
								title="Delete"
							>
								✕
							</Button>
						</div>
					</div>
				))}
			</div>
		</aside>
	);
}
