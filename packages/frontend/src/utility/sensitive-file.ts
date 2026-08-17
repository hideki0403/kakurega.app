/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as Misskey from 'misskey-js';
import * as os from '@/os.js';
import { prefer } from '@/preferences.js';
import { i18n } from '@/i18n.js';
import { getDataSaverState } from '@/utility/datasaver.js';

export function shouldHideFileByDefault(file: Misskey.entities.DriveFile, ignoreDataSaver = false): boolean {
	if (prefer.s.nsfw === 'force' || (!ignoreDataSaver && getDataSaverState('media'))) {
		return true;
	}

	if (file.isSensitive && prefer.s.nsfw !== 'ignore') {
		return true;
	}

	return false;
}

export async function canRevealFile(file: Misskey.entities.DriveFile): Promise<boolean> {
	if (file.isSensitive && prefer.s.confirmWhenRevealingSensitiveMedia) {
		const { canceled } = await os.confirm({
			type: 'question',
			text: i18n.ts.sensitiveMediaRevealConfirm,
		});
		if (canceled) return false;
	}

	return true;
}
