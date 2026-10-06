import { useState } from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import { WorkItemMedia } from '../WorkItemMedia';
import styles from './HomeFeaturedWork.module.scss';

let cx = classNames.bind(styles);

// Brief section 05/06: a curated, numbered selection (not the full archive —
// that's /portfolio) with a hover preview and a click-through to the single
// work page. The brief's "Project Viewer" pop-up (in-place modal, returns to
// the same scroll position) isn't built yet — this scaffold links out to
// /work/[slug] instead; swap once that modal exists.
export default function HomeFeaturedWork({ works }) {
	const [activeIndex, setActiveIndex] = useState(null);
	if (!works?.length) return null;

	const active = activeIndex != null ? works[activeIndex] : null;

	return (
		<section className={cx('component')}>
			<Container>
				<h2 className={cx('heading')}>
					Featured<br />Work
				</h2>

				<div className={cx('layout')}>
					<ol className={cx('list')}>
						{works.map((work, i) => {
							const category = work.workTypes?.nodes?.[0]?.name;
							return (
								<li key={work.slug} className={cx('item')}>
									<Link
										href={`/work/${work.slug}`}
										className={cx('link')}
										onMouseEnter={() => setActiveIndex(i)}
										onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
									>
										<span className={cx('index')}>{String(i + 1).padStart(2, '0')}</span>
										<span className={cx('title')}>{work.title}</span>
										{category && <span className={cx('category')}>{category}</span>}
									</Link>
								</li>
							);
						})}
					</ol>

					<div className={cx('preview', { active: Boolean(active) })} aria-hidden="true">
						{active && <WorkItemMedia work={active} />}
					</div>
				</div>

				<Link href="/portfolio" className={cx('view-all')}>
					View all work <span aria-hidden="true">→</span>
				</Link>
			</Container>
		</section>
	);
}

HomeFeaturedWork.fragments = {
	entry: gql`
		${WorkItemMedia.fragments.entry}
		fragment HomeFeaturedWorkFragment on Work {
			title
			slug
			workTypes {
				nodes {
					name
				}
			}
			...WorkMediaFragment
		}
	`,
};
