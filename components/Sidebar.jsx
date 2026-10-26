import React from "react";

const items = ["Beranda", "Proyek", "Tim", "Pengaturan"];

export default function Sidebar() {
	return (
		<aside className="sidebar">
			<h2 className="sidebar__brand">SideBar</h2>
			<nav aria-label="Navigasi utama">
				{items.map((item, index) => (
					<a
						key={item}
						href="#"
						className={`sidebar__link${index === 0 ? " sidebar__link--active" : ""}`}
					>
						{item}
					</a>
				))}
			</nav>
			<style>{`
				.sidebar {
					box-sizing: border-box;
					width: 240px;
					min-height: 100vh;
					padding: 24px 16px;
					background: #111827;
					color: #f9fafb;
					font-family: sans-serif;
				}
				.sidebar__brand {
					margin: 0 12px 28px;
					font-size: 20px;
				}
				.sidebar__link {
					display: block;
					margin: 4px 0;
					padding: 12px;
					border-radius: 6px;
					color: #9ca3af;
					text-decoration: none;
				}
				.sidebar__link:hover,
				.sidebar__link--active {
					background: #374151;
					color: #fff;
				}
			`}</style>
		</aside>
	);
}
