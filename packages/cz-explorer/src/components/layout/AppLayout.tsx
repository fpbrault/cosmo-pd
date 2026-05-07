import { type ReactNode, useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";

interface AppLayoutProps {
	children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(true);

	return (
		<main className="flex h-full min-h-0 w-full min-w-0 flex-col">
			<div className="flex h-full min-h-0 min-w-0 flex-row overflow-hidden">
				<AppSidebar
					leftPanelCollapsed={leftPanelCollapsed}
					setLeftPanelCollapsed={setLeftPanelCollapsed}
				/>
				<div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
			</div>
		</main>
	);
}
